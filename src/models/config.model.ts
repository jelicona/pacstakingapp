import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';


class Config extends Model {
  public id!: number;
  public key!: string;
  public value!: string;
}

Config.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'configs',
});

export default Config;