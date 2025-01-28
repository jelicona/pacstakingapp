import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Validator extends Model {
  public id!: number;
  public address!: string;
  public balance!: number;
  public stake!: number;
  public reward_address!: string;
}

Validator.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  validator_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  validator_id: {
    type: DataTypes.INTEGER,
    unique: true
  },
}, {
  sequelize,
  modelName: 'Validator',
  tableName: 'validators',
  indexes: [
    {
      fields: ['validator_id'],  // Esto crea un índice en validator_id
    },]
});

export default Validator;