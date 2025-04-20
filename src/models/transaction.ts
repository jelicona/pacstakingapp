import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Wallet from './wallet';

class Transaction extends Model {
  public id!: number;
  public type!: 'TRANSFER' | 'WITHDRAW' | 'BOND' | 'UNBOND';
  public source_wallet!: string;
  public dest_wallet!: string;
  public amount!: number;
  public status_path!: string;
  public programmed!: boolean;
  public from_walletid!: number;
  public to_walletid!: number;
} 

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('TRANSFER', 'WITHDRAW', 'BOND', 'UNBOND'),
    allowNull: false,
  },
  source_wallet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dest_wallet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  programmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  from_walletid: {
    type: DataTypes.INTEGER,
    references: {
      model: Wallet,
      key: 'id'
    },
    allowNull: true
  },
  to_walletid: {
    type: DataTypes.INTEGER,
    references: {
      model: Wallet,
      key: 'id'
    },
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transaction',
  hooks: {
    beforeCreate: (transaction: Transaction) => {
      transaction.status_path = 'INIT';
    }
  },
}); 

Transaction.belongsTo(Wallet, { foreignKey: 'from_walletid' });
Transaction.belongsTo(Wallet, { foreignKey: 'to_walletid' });
Wallet.hasMany(Transaction, { foreignKey: 'from_walletid' });
Wallet.hasMany(Transaction, { foreignKey: 'to_walletid' });



export default Transaction;