import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class JobConfig extends Model {
  public id!: number;
  public name!: string;
  public type!: string;
  public enabled!: boolean;
  public frequency!: number; // in seconds
  public config!: object;
  public last_run?: Date | null;
  public next_run?: Date | null;
  public status!: 'IDLE' | 'RUNNING' | 'PAUSED' | 'FAILED';
  public error_message?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JobConfig.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique identifier for the job'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of job (e.g., balance-history, rewards-distribution)'
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether the job is enabled or not'
  },
  frequency: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 300, // Default frequency: 5 minutes (300 seconds)
    comment: 'Frequency in seconds for repeatable jobs'
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional configuration for the job'
  },
  last_run: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time the job was executed'
  },
  next_run: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Next scheduled execution time'
  },
  status: {
    type: DataTypes.ENUM('IDLE', 'RUNNING', 'PAUSED', 'FAILED'),
    allowNull: false,
    defaultValue: 'IDLE',
    comment: 'Current status of the job'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Last error message if job failed'
  }
}, {
  sequelize,
  tableName: 'jobs_config',
  timestamps: true,
  underscored: true,
});

export default JobConfig;    