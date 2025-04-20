import sequelize from './database';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import Schedule from '../models/schedule';
import WalletHistory from '../models/walletHistory';

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
    // Conectar a la base de datos
    await Wallet.sync();

    // Array de registros a insertar


    // Insertar registros si no existen

  } catch (error) {
    console.error('Error al insertar registros:', error);
  }
}


