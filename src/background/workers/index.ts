import { Worker } from "bullmq";
import { balanceHistoryWorker } from "./balance-history.worker";
import { redisClient } from "../../config/redis";

// Array of all workers
export const workers: Worker[] = [
  balanceHistoryWorker,
  // Add more workers here as you create them
  // rewardsDistributionWorker,
  // transactionMonitoringWorker,
];

// Initialize all workers
export async function initializeWorkers(): Promise<void> {
  console.log("[Workers] Initializing background workers...");

  try {
    // 1. Verificar conexión a Redis
    await redisClient.ping();
    console.log("[Workers] ✅ Redis connection verified");

    // 2. Verificar que los workers estén listos
    for (const worker of workers) {
      // Verificar que el worker no esté cerrado
      if (!worker.isRunning()) {
        console.warn(`[Workers] ⚠️ Worker ${worker.name} is not running`);
      } else {
        console.log(
          `[Workers] ✅ Worker ${worker.name} is running and listening`
        );
      }
    }

    console.log(
      `[Workers] ✅ ${workers.length} worker(s) initialized successfully`
    );
  } catch (error) {
    console.error("[Workers] ❌ Error initializing workers:", error);
    throw error;
  }
}

// Graceful shutdown for all workers
export async function shutdownWorkers(): Promise<void> {
  console.log("[Workers] Shutting down workers...");

  await Promise.all(
    workers.map(async (worker) => {
      console.log(`[Workers] Closing worker: ${worker.name}`);
      await worker.close();
    })
  );

  console.log("[Workers] All workers shut down successfully");
}

export { balanceHistoryWorker };

export default workers;
