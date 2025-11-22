import { Queue } from 'bullmq';
import redisConnection from '../../config/redis';
import { BalanceHistoryJobData } from '../../types/jobs';

// Create queue for balance history jobs
export const balanceHistoryQueue = new Queue<BalanceHistoryJobData>('balance-history', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  },
});

export default balanceHistoryQueue;
