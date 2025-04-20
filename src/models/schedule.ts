import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Wallet from './wallet';
import Transaction from './transaction';

class Schedule extends Model {
  public id!: number;
  public type!: 'TRANSFER' | 'WITHDRAW' | 'BOND' | 'UNBOND';
  public transacction_id!: number;
  public job_date!: Date;
  public status_path!: string;
}

Schedule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('TRANSFER', 'WITHDRAW', 'BOND', 'UNBOND'),
        allowNull: false,
    },
    transacction_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Transaction,
            key: 'id'
        },
        allowNull: false
    },
    job_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'schedule',
    indexes: [
        {
            fields: ['transacction_id'],  // Esto crea un índice en validator_id
        },
    ]
});

Schedule.belongsTo(Transaction, { foreignKey: 'transacction_id' });
Transaction.hasMany(Schedule, { foreignKey: 'transacction_id' });
Schedule.belongsTo(Wallet, { foreignKey: 'transacction_id' });
Wallet.hasMany(Schedule, { foreignKey: 'transacction_id' });

export default Schedule;