import { IWalletInterface } from "../../interfaces/wallet.interface";
import Wallet from "../../models/wallet";
import { Boom } from "@hapi/boom";
import boom from '@hapi/boom';

class StakingWalletService {
  constructor() {

  }

  // Method to add new staking wallet
  async addStakingWallet(
    params: IWalletInterface
  ): Promise<{ message: string; data: Wallet } | undefined> {
    // Logic to add the Staking wallet
    try {
      const walletAddress = await Wallet.findOne({
        where: {
          address: params.address,
        },
      });

      if (walletAddress) throw boom.conflict("Wallet already exists");

      const newWallet = await Wallet.create({
        type: "Staking",
        name: params.name,
        address: params.address,
        index: params.index,
        balance: params.balance,
        staking: params.staking,
        status: params.status,
      }).catch((error) => {
        console.error("Error creating Staking wallet:", error);
        throw boom.internal("Internal Server Error", error.message);
      });
      return {
        message: "Staking wallet created successfully",
        data: newWallet,
      };

    } catch (error) {
      console.error("Error adding Staking wallet:", error);
      throw error;
    }
  }

  async updateStakingWallet(params: any): Promise<any> {

    try {
      const walletId = params.walletId; 
      const wallet = await Wallet.findOne({
        where: {
          id: walletId,
        },
      });

      if (!wallet) throw boom.notFound("Wallet not found");

      //merge the existing wallet data with the new data
      //revisar luego
      const newWalletData = {
        ...wallet.toJSON(),
        ...params
      };
      
      await Wallet.update(params, {
        where: {
          id: walletId,
        },
      }).catch((error) => {
        console.error("Error updating Staking wallet:", error);
        throw boom.internal("Internal Server Error", error.message);
      });
      console.log(`Updated ${wallet} with ${newWalletData}`);
      await wallet.save(); // Save the changes

      return {
        message: "Staking wallet updated successfully",
        data: newWalletData,
      };

    } catch (error) {
      console.error("Error updating Staking wallet:", error);
      throw error;
    }
  }


  async deleteStakingWallet(userId: string): Promise<Record<string, any>> {
    try {
      const wallet = await Wallet.findOne({
        where: {
          id: userId,
        },
      });

      if (!wallet) throw boom.notFound("Wallet not found");

      await wallet.destroy().catch((error) => {
        console.error("Error deleting Staking wallet:", error);
        throw boom.internal("Internal Server Error", error.message);
      });

      return {
        message: "Staking wallet deleted successfully",
        data: wallet,
      };
    } catch (error) {
      console.error("Error deleting Staking wallet:", error);
      throw error;
    }
  }


  async getStakingWalletByAddress(walletAddress: string): Promise<any> {
    try {
      const wallet = await Wallet.findOne({
        where: {
          address: walletAddress,
        },
      });

      if (!wallet) throw boom.notFound("Wallet not found");

      return {
        message: "Staking wallet fetched successfully",
        data: wallet,
      };
    } catch (error) {
      console.error("Error fetching Staking wallet by address:", error);
      throw error;
    }
  }
}

export default new StakingWalletService();
