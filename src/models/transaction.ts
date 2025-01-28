import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Validator from './validator';

class Transaction extends Model {
  public id!: number;
  public validator_id!: number;
  public amount!: number;
}

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  validator_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Validator,
        key: 'validator_id',
    },
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions',
}); 

export default Transaction;