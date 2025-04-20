import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import e from 'express';

class Wallet extends Model {
  public id!: number;
  public type!: string;
  public name!: string;
  public address!: string;
  public index!: number;
  public balance!: number;
  public staking!: number;
  public status!: 'BOND' | 'UNBOND' | 'PENDING_UNSTAKE';
}

Wallet.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  staking: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('BOND', 'UNBOND', 'PENDINDG_UNSTAKE'),
    allowNull: true,
  },

}, {
  sequelize,
  modelName: 'Wallet',
  tableName: 'wallet',
  indexes: [
    {
      fields: ['index'],  // Esto crea un índice en validator_id
    },],
  hooks: {
    beforeCreate: (wallet: Wallet) => {
      wallet.balance = 0;
      wallet.staking = 0;
      wallet.status = 'BOND';
    }
  }
});

export default Wallet;