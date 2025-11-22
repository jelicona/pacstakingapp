import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class WalletHistory extends Model {
  public id!: number;
  public walletid!: number;
  public valueatdate!: number;
  public date_ejecuted!: Date;
}

WalletHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    walletid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valueatdate: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
    },
    date_ejecuted: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "WalletHistory",
    tableName: "wallet_history",
    timestamps: false,
    indexes: [
      {
        fields: ["walletid"],
      },
    ],
  }
);

export default WalletHistory;
