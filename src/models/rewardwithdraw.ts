import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Validator from './validator';

class RewardWithdraw extends Model {
  public id!: number;
  public validator_id!: number;
  public reward_address!: string;
  public total_sent!: number;
}

RewardWithdraw.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  validator_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Validator,
        key: 'id',
    },
    allowNull: false,
  },
  reward_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'RewardWithdraw',
  tableName: 'rewardwithdraw',
}); 

export default RewardWithdraw;