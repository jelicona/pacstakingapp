import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Wallet extends Model {
  public id!: number;
  public type!: "REWARD" | "VALIDATOR" | "EXTERNAL";
  public name!: string;
  public address!: string;
  public index!: number;
  public balance!: number;
  public staking!: number;
  public status!: "BOND" | "UNBOND" | "PENDING_UNSTAKE" | null;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("REWARD", "VALIDATOR", "EXTERNAL"),
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
      unique: true,
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
      type: DataTypes.ENUM("BOND", "UNBOND", "PENDING_UNSTAKE"),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Wallet",
    tableName: "wallet",
    indexes: [
      {
        unique: true,
        fields: ["index"], // ✅ Índice único en index
      },
      {
        unique: true,
        fields: ["address"], // También mantener unique en address
      },
    ],
    hooks: {
      beforeCreate: (wallet: Wallet) => {
        if (wallet.type == "VALIDATOR") wallet.balance = 0;
        if (wallet.type == "REWARD") wallet.status = null;
      },
    },
  }
);

export default Wallet;
