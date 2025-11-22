import { Queue } from 'bullmq';
import { balanceHistoryQueue } from './balance-history.queue';
import { JobType } from '../../types/jobs';

// Map of all queues
export const queues: Map<string, Queue> = new Map([
  [JobType.BALANCE_HISTORY, balanceHistoryQueue],
  // añadir nuevas queues
  // [JobType.REWARDS_DISTRIBUTION, rewardsDistributionQueue],
  // [JobType.TRANSACTION_MONITORING, transactionMonitoringQueue],
]);

// Helper to get queue by job type
export function getQueueByType(jobType: string): Queue | undefined {
  return queues.get(jobType);
}

// Export individual queues
export { balanceHistoryQueue };

export default queues;
