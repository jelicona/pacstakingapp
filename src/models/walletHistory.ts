import { DataTypes, Model } from 'sequelize';
import sequelize  from '../config/database';
import Wallet from './wallet';

class WalletHistory extends Model {
  public id!: number;
    public walletid!: number;
    public valueatdate!: number;
    public date_ejecuted!: Date;
}

WalletHistory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    walletid: {
        type: DataTypes.INTEGER,
        references: {
            model: Wallet,
            key: 'id'
        },
        allowNull: false
    },
    valueatdate: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
    },
    date_ejecuted: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'WalletHistory',
    tableName: 'wallet_history',
    timestamps: false,
    indexes: [
        {
            fields: ['walletid'],  // Esto crea un índice en validator_id
        },
    ]
});

WalletHistory.belongsTo(Wallet, { foreignKey: 'walletid' });
Wallet.hasMany(WalletHistory, { foreignKey: 'walletid' });

export default WalletHistory;
