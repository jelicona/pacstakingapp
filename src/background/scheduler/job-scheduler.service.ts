import { Queue } from 'bullmq';
import JobConfig from '../../models/jobsConfig.model';
import { getQueueByType } from '../queues';
import { JobType, SyncResult } from '../../types/jobs';

class JobSchedulerService {
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL_MS = 60000; // Sync every 1 minute

  /**
   * Starts the job scheduler service
   * Syncs database configs with BullMQ repeatable jobs
   */
  async start(): Promise<void> {
    console.log("[Job Scheduler] Starting job scheduler service...");

    // Initial sync
    await this.syncJobs();

    // Schedule periodic sync
    this.syncInterval = setInterval(async () => {
      await this.syncJobs();
    }, this.SYNC_INTERVAL_MS);

    console.log("[Job Scheduler] Job scheduler service started successfully");
  }

  /**
   * Stops the job scheduler service
   */
  async stop(): Promise<void> {
    console.log("[Job Scheduler] Stopping job scheduler service...");

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    console.log("[Job Scheduler] Job scheduler service stopped");
  }

  /**
   * Synchronizes database job configurations with BullMQ repeatable jobs
   */
  async syncJobs(): Promise<SyncResult> {
    const result: SyncResult = {
      synced: [],
      removed: [],
      errors: [],
    };

    try {
      console.log("[Job Scheduler] Syncing jobs from database...");

      // Get all job configurations from database
      const jobConfigs = await JobConfig.findAll();

      // Track which jobs should exist
      const activeJobKeys = new Set<string>();

      // Process each job configuration
      for (const config of jobConfigs) {
        try {
          const queue = getQueueByType(config.type);

          if (!queue) {
            console.warn(
              `[Job Scheduler] No queue found for job type: ${config.type}`
            );
            result.errors.push({
              jobName: config.name,
              error: `No queue found for type: ${config.type}`,
            });
            continue;
          }

          const jobKey = `${config.type}:${config.name}`;
          activeJobKeys.add(jobKey);

          if (config.enabled && config.status !== "PAUSED") {
            // Add or update repeatable job
            await this.addOrUpdateRepeatableJob(queue, config);
            result.synced.push(config.name);
          } else {
            // Remove repeatable job if disabled or paused
            await this.removeRepeatableJob(queue, config);
            result.removed.push(config.name);
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error(
            `[Job Scheduler] Error syncing job ${config.name}:`,
            errorMessage
          );
          result.errors.push({
            jobName: config.name,
            error: errorMessage,
          });
        }
      }

      // Remove repeatable jobs that no longer exist in database
      await this.cleanupOrphanedJobs(activeJobKeys);

      console.log("[Job Scheduler] Sync completed:", {
        synced: result.synced.length,
        removed: result.removed.length,
        errors: result.errors.length,
      });
    } catch (error) {
      console.error("[Job Scheduler] Error during sync:", error);
      throw error;
    }

    return result;
  }

  /**
   * Adds or updates a repeatable job in BullMQ
   */
  private async addOrUpdateRepeatableJob(
    queue: Queue,
    config: any
  ): Promise<void> {
    const frequencyInSeconds = config.frequency;
    const frequencyInMinutes = Math.floor(frequencyInSeconds / 60);
    const frequencyInHours = Math.floor(frequencyInSeconds / 3600);

    let repeatPattern;

    // Si es múltiplo exacto de horas (3600, 7200, 10800...)
    if (
      frequencyInSeconds % 3600 === 0 &&
      frequencyInHours >= 1 &&
      frequencyInHours <= 23
    ) {
      // Usar cron para horas exactas
      repeatPattern = { pattern: `0 */${frequencyInHours} * * *` };
    }
    // Si es múltiplo exacto de minutos Y cabe en cron (1-59 minutos)
    else if (
      frequencyInSeconds % 60 === 0 &&
      frequencyInMinutes >= 1 &&
      frequencyInMinutes <= 59
    ) {
      // Usar cron para minutos exactos
      repeatPattern = { pattern: `*/${frequencyInMinutes} * * * *` };
    }
    // Para cualquier otro caso (fracciones, > 59 min, < 1 min)
    else {
      // Usar milliseconds (más flexible)
      repeatPattern = { every: frequencyInSeconds * 1000 };
    }

   const repeatableJobs = await queue.getRepeatableJobs();
   console.log(`[DEBUG] Repeatable jobs BEFORE remove:`, repeatableJobs.length);
   console.log(`[DEBUG] Jobs in queue:`, await queue.getJobCounts()); // ← NUEVO

   const existingJob = repeatableJobs.find((job) => job.name === config.name);

   if (existingJob) {
     console.log(`[DEBUG] Found existing job:`, {
       name: existingJob.name,
       key: existingJob.key,
       next: existingJob.next,
       pattern: existingJob.pattern,
       every: existingJob.every,
     });

     await queue.removeRepeatableByKey(existingJob.key);
     console.log(`[DEBUG] Removed job key: ${existingJob.key}`);
   }

   const jobId = `${config.type}:${config.name}`;

   await queue.add(
     config.name,
     {
       jobConfigId: config.id,
       timestamp: new Date(),
       config: config.config || {},
     },
     {
       repeat: repeatPattern,
       jobId: jobId,
     }
   );

   const repeatableJobsAfter = await queue.getRepeatableJobs();
   console.log(
     `[DEBUG] Repeatable jobs AFTER add:`,
     repeatableJobsAfter.length
   );
   console.log(`[DEBUG] Jobs in queue AFTER:`, await queue.getJobCounts()); // ← NUEVO

   const newJob = repeatableJobsAfter.find((j) => j.name === config.name);
   console.log(`[DEBUG] New job details:`, {
     name: newJob?.name,
     key: newJob?.key,
     next: newJob?.next,
     pattern: newJob?.pattern,
     every: newJob?.every,
   });

    
    const nextRun = new Date(Date.now() + config.frequency * 1000);
    await JobConfig.update({ next_run: nextRun }, { where: { id: config.id } });

    console.log(
      `[Job Scheduler] Job ${
        config.name
      } scheduled with pattern: ${JSON.stringify(repeatPattern)}`
    );
  }

  /**
   * Removes a repeatable job from BullMQ
   */
  private async removeRepeatableJob(queue: Queue, config: any): Promise<void> {
    const repeatableJobs = await queue.getRepeatableJobs();
    const existingJob = repeatableJobs.find((job) => job.name === config.name);

    if (existingJob) {
      await queue.removeRepeatableByKey(existingJob.key);
      console.log(`[Job Scheduler] Removed repeatable job: ${config.name}`);
    }
  }

  /**
   * Cleans up orphaned jobs that exist in BullMQ but not in database
   */
  /**
   * Cleans up orphaned jobs that exist in BullMQ but not in database
   */
  private async cleanupOrphanedJobs(activeJobKeys: Set<string>): Promise<void> {
    const { queues } = require("../queues");

    for (const [queueType, queue] of queues.entries()) {
      const repeatableJobs = await queue.getRepeatableJobs();

      for (const job of repeatableJobs) {
        // ✅ CORRECCIÓN: Crear la clave de la misma forma que en syncJobs
        const jobKey = `${queueType}:${job.name}`;

        if (!activeJobKeys.has(jobKey)) {
          await queue.removeRepeatableByKey(job.key);
          console.log(
            `[Job Scheduler] Cleaned up orphaned job: ${jobKey} from queue: ${queueType}`
          );
        }
      }
    }
  }
  /**
   * Manually triggers a job to run immediately
   */
  async triggerJob(jobConfigId: number): Promise<void> {
    const config = await JobConfig.findByPk(jobConfigId);

    if (!config) {
      throw new Error(`Job config with ID ${jobConfigId} not found`);
    }

    const queue = getQueueByType(config.type);

    if (!queue) {
      throw new Error(`No queue found for job type: ${config.type}`);
    }

    // Add job to queue for immediate execution
    await queue.add(
      `${config.name}-manual`,
      {
        jobConfigId: config.id,
        timestamp: new Date(),
        config: config.config || {},
      },
      {
        priority: 1, // High priority for manual triggers
      }
    );

    console.log(`[Job Scheduler] Manually triggered job: ${config.name}`);
  }

  /**
   * Pauses a job
   */
  async pauseJob(jobConfigId: number): Promise<void> {
    const config = await JobConfig.findByPk(jobConfigId);

    if (!config) {
      throw new Error(`Job config with ID ${jobConfigId} not found`);
    }

    await JobConfig.update(
      { status: "PAUSED" },
      { where: { id: jobConfigId } }
    );

    // Remove from BullMQ
    const queue = getQueueByType(config.type);
    if (queue) {
      await this.removeRepeatableJob(queue, config);
    }

    console.log(`[Job Scheduler] Paused job: ${config.name}`);
  }

  /**
   * Resumes a paused job
   */
  async resumeJob(jobConfigId: number): Promise<void> {
    const config = await JobConfig.findByPk(jobConfigId);

    if (!config) {
      throw new Error(`Job config with ID ${jobConfigId} not found`);
    }

    if (!config.enabled) {
      throw new Error(`Cannot resume disabled job: ${config.name}`);
    }

    await JobConfig.update({ status: "IDLE" }, { where: { id: jobConfigId } });

    // Add back to BullMQ
    const queue = getQueueByType(config.type);
    if (queue) {
      await this.addOrUpdateRepeatableJob(queue, config);
    }

    console.log(`[Job Scheduler] Resumed job: ${config.name}`);
  }
}

// Export singleton instance
export const jobSchedulerService = new JobSchedulerService();
export default jobSchedulerService;
