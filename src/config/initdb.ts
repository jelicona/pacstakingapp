import sequelize from './database';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import Schedule from '../models/schedule';
import WalletHistory from '../models/walletHistory';
import GetValidator from '../services/global/getvalidator.service';
import { IValidatorInterface } from '../interfaces/validator.interface';
import { get } from 'mongoose';

export async function syncDatabase() {
  Wallet
  Transaction
  Schedule
  WalletHistory
  try {
    await sequelize.sync();
    console.log("Database & tables created!");
    await insertWallets();
    console.log("Wallets inserted!");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
}

// Función para insertar registros
async function insertWallets() {
  try {
    await GetValidator.init();
    // Conectar a la base de datos
    await Wallet.sync();

    // Array de registros a insertar
    let validators: Record<string, IValidatorInterface> = await GetValidator.findAll();
    console.log('validators from api service: ', validators)
  

    // Insertar registros si no existen
    for (const [key, validator] of Object.entries(validators)) {
      const [wallet, created] = await Wallet.findOrCreate({
        where: { address: validator.address },
        defaults: {
          type: 'Validator',
          name: key,
          address: validator.address,
          index: validator.id,
          balance: validator.balance,
          staking: validator.stake,
          status: 'BOND',
        },
      });

      if (created) {
        console.log(`Inserted wallet with address ${validator.address}`);
      } else {
        console.log(`Wallet with address ${validator.address} already exists`);
      }
    }

  } catch (error) {
    console.error('Error al insertar registros:', error);
  }
}


