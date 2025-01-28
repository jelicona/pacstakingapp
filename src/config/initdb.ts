import Validator from '../models/validator';

// Función para insertar registros
async function insertValidators() {
  try {
    // Conectar a la base de datos
    await Validator.sync();

    // Array de registros a insertar
    const validators = [
      { validator_address: 'pc1pp6ga6nla4c3xcw8vpv909ca5dg4yfuk7pys6u8', validator_id: 1 },
      { validator_address: 'pc1pw964rj0nl5r9krg2jygz9w4eelnnqheppr5mhp', validator_id: 2 },
      { validator_address: 'pc1pjaxuk46kvwd64usxv74dqeszectxcmsg6hz0gr', validator_id: 3 },
      { validator_address: 'pc1pll5su647ypnjv839hrwpxwkjz4ryg6m20nzdtk', validator_id: 4 }
    ];

    // Insertar registros si no existen
    for (const validator of validators) {
      const exists = await Validator.findOne({ where: { validator_id: validator.validator_id } });
      if (!exists) {
        await Validator.create(validator);
        console.log(`Registro con validator_id ${validator.validator_id} insertado.`);
      } else {
        console.log(`Registro con validator_id ${validator.validator_id} ya existe, no se inserta.`);
      }
    }
  } catch (error) {
    console.error('Error al insertar registros:', error);
  }
}

// Ejecutar la función
export default insertValidators;
