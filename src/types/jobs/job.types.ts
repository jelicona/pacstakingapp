// Job types enumeration
export enum JobType {
  BALANCE_HISTORY = 'balance-history',
}

// Job status enumeration
export enum JobStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED'
}

// Base interface for job data
export interface JobData {
  jobConfigId: number;
  timestamp: Date;
  config?: Record<string, any>;
}

// Specific job data interfaces
export interface BalanceHistoryJobData extends JobData {
  walletId?: number;
  batchSize?: number;
}


// Job configuration interface
export interface IJobConfig {
  id?: number;
  name: string;
  type: JobType | string;
  enabled: boolean;
  frequency: number; // in seconds
  config?: Record<string, any>;
  last_run?: Date | null;
  next_run?: Date | null;
  status: JobStatus;
  error_message?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Job execution result
export interface JobResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  executionTime?: number; // in milliseconds
}

// Job scheduler sync result
export interface SyncResult {
  synced: string[];
  removed: string[];
  errors: Array<{ jobName: string; error: string }>;
}
