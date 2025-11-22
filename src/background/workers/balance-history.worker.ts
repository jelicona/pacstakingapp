import { Worker, Job } from "bullmq";
import redisConnection from "../../config/redis";
import { BalanceHistoryJobData, JobResult } from "../../types/jobs";
import { executeBalanceHistoryJob } from "../jobs/balance-history.job";
import JobConfig from "../../models/jobsConfig.model";

// Create worker for balance history jobs
export const balanceHistoryWorker = new Worker<
  BalanceHistoryJobData,
  JobResult
>(
  "balance-history",
  async (job: Job<BalanceHistoryJobData>): Promise<JobResult> => {
    const startTime = Date.now();

    try {
      console.log(
        `${new Date(Date.now())} : [Balance History Worker] Processing job ${
          job.id
        }...`
      );

      // Obtener config del job
      const config = await JobConfig.findByPk(job.data.jobConfigId);
      if (!config) {
        throw new Error(`Job config ${job.data.jobConfigId} not found`);
      }

      // Update job status to RUNNING in database
      await JobConfig.update(
        { status: "RUNNING", last_run: new Date() },
        { where: { id: job.data.jobConfigId } }
      );

      // Execute the actual job logic
      const result = await executeBalanceHistoryJob(job.data);

      const executionTime = Date.now() - startTime;
      console.log(
        `${new Date(Date.now())} [Balance History Worker] Job ${
          job.id
        } completed in ${executionTime}ms`
      );

      // Calcular next_run basándose en frequency
      const nextRun = new Date(Date.now() + config.frequency * 1000);

      // Update job status to IDLE in database
      await JobConfig.update(
        {
          status: "IDLE",
          error_message: null,
          next_run: nextRun,
        },
        { where: { id: job.data.jobConfigId } }
      );

      return {
        success: result.success,
        message: result.message,
        error: result.error,
        data: result.data,
        executionTime: result.executionTime || executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error(
        `${new Date(Date.now())} [Balance History Worker] Job ${
          job.id
        } failed:`,
        errorMessage
      );

      // Update job status to FAILED in database
      if (job.data.jobConfigId) {
        await JobConfig.update(
          {
            status: "FAILED",
            error_message: errorMessage,
          },
          { where: { id: job.data.jobConfigId } }
        );
      }

      return {
        success: false,
        error: errorMessage,
        executionTime,
      };
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

// Event listeners
balanceHistoryWorker.on("completed", async (job, returnvalue) => {
  console.log(`[Balance History Worker] Job ${job.id} completed`);

  if (returnvalue.success) {
    console.log(`✅ Success: ${returnvalue.message || "Job completed"}`);
    console.log(`⏱️ Execution time: ${returnvalue.executionTime || 0}ms`);

    if (returnvalue.executionTime && returnvalue.executionTime > 10000) {
      console.warn("⚠️ Job took longer than 10s, consider optimization");
    }
  } else {
    console.error(`❌ Job failed: ${returnvalue.error}`);
  }
});

balanceHistoryWorker.on("failed", (job, err) => {
  console.error(
    `[Balance History Worker] Job ${job?.id} has failed:`,
    err.message
  );
});

balanceHistoryWorker.on("error", (err) => {
  console.error("[Balance History Worker] Worker error:", err);
});

export default balanceHistoryWorker;
