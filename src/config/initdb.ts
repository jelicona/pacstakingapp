import sequelize from "./database";
import Config from "../models/config.model";
import Wallet from "../models/wallet";
import Transaction from "../models/transaction";
import Schedule from "../models/schedule";
import JobConfig from "../models/jobsConfig.model";
import WalletHistory from "../models/walletHistory";
import GetValidator from "../services/global/getvalidator.service";
import { IValidatorInterface } from "../interfaces/validator.interface";
import { JobType, JobStatus } from "../types/jobs";
import { initializeAssociations } from "../models/associations";

export async function syncDatabase() {
  // ✅ IMPORTANTE: Inicializar asociaciones ANTES del sync
  initializeAssociations();

  try {

    await sequelize.sync({ force: false }); // force: false para no eliminar datos
    console.log("Database & tables created!");

    await insertWallets();
    console.log("Wallets inserted!");

    await insertInitialJob();
    console.log("Initial jobs created!");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
}

// Función para insertar registros de wallets
async function insertWallets() {
  try {
    await GetValidator.init();

    let validators: Record<string, IValidatorInterface> =
      await GetValidator.findAll();
    console.log("validators from api service: ", validators);

    // Insertar validators
    for (const [key, validator] of Object.entries(validators)) {
      const [wallet, created] = await Wallet.findOrCreate({
        where: { address: validator.address },
        defaults: {
          type: "VALIDATOR",
          name: key,
          address: validator.address,
          index: parseInt(validator.id),
          balance: validator.balance,
          staking: parseInt(validator.stake),
          status: "BOND",
        },
      });

      if (created) {
        console.log(`Inserted wallet with address ${validator.address}`);
      } else {
        console.log(`Wallet with address ${validator.address} already exists`);
      }
    }

    // Insertar wallet REWARD
    const [rewardWallet, rewardCreated] = await Wallet.findOrCreate({
      where: { address: "pc1rvsn4zwmj2n2jt59cztcvjcp27q0rh9echjyw54" },
      defaults: {
        type: "REWARD",
        name: "UNIQUE_REWARD_ADDRESS",
        address: "pc1rvsn4zwmj2n2jt59cztcvjcp27q0rh9echjyw54",
        index: 555,
        balance: 0,
        staking: 0,
        status: null,
      },
    });

    if (rewardCreated) {
      console.log("Inserted REWARD wallet");
    } else {
      console.log("REWARD wallet already exists");
    }
  } catch (error) {
    console.error("Error al insertar registros:", error);
  }
}

// Función para insertar job inicial
async function insertInitialJob() {
  try {
    const rewardWallet = await Wallet.findOne({
      where: { name: "UNIQUE_REWARD_ADDRESS" },
    });

    const frequency = 3600; // 60 minutos
    const nextRun = new Date(Date.now() + frequency * 1000);

    const [job, created] = await JobConfig.findOrCreate({
      where: { name: "balance-history-daily" },
      defaults: {
        name: "balance-history-daily",
        type: JobType.BALANCE_HISTORY,
        enabled: true,
        frequency: frequency,
        config: {
          batchSize: 10,
          description: "Daily balance history snapshot for all wallets",
          targetWalletId: rewardWallet?.index || null,
        },
        status: JobStatus.IDLE,
        next_run: nextRun,
        last_run: null,
        error_message: null,
      },
    });

    if (created) {
      console.log('✅ Job "balance-history-daily" created');
    } else {
      console.log('ℹ️ Job "balance-history-daily" already exists');
    }
  } catch (error) {
    console.error("❌ Error creating initial job:", error);
    throw error;
  }
}
