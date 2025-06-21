import { IWalletInterface } from "../../interfaces/wallet.interface";
import Wallet from "../../models/wallet";
import boom from '@hapi/boom';


class RewardWalletService {
  constructor() {

  }


  // Method to add new reward wallet
  async addRewardWallet(params: IWalletInterface): Promise<{message: string, data: Wallet} | undefined> {

      try {
          const walletAddress = await Wallet.findOne({
              where: {
                  address: params.address,
              }
          });
          
          if (walletAddress) throw boom.conflict("Wallet already exists", params.address);
    
        const newWallet = await Wallet.create({
            type: 'Reward',
            name: params.name,
            address: params.address,
            index: params.index,
            balance: params.balance,
            staking: null,
            status: null,
        });
        return {
            message: "Reward wallet created successfully",
            data: newWallet,
        };
              
      } catch (error) {
          console.error("Error adding reward wallet:", error);
          throw error;
      }

  }
    
  async updateRewardWallet(params:any): Promise<any> {

    try {
      const walletId = params.walletId; // Assuming userId is passed in params
      const wallet = await Wallet.findOne({
        where: { id: walletId },
        });

      if (!wallet) throw boom.notFound("Wallet not found", walletId);

      const newWalletData = {
        ...wallet,
        ...params
      };
      // Merge existing wallet data with new params
      await Wallet.update(newWalletData, {
        where: {
          id: walletId,
        },
      }).then().catch((error) => {
        if(error.name === "SequelizeUniqueConstraintError") {
          throw boom.conflict("El address ya existe", error);
        }
        console.error("Error updating reward wallet:", error);
        throw boom.internal("Internal Server Error", error.message);
      });

      console.log(
        `Updated ${JSON.stringify(wallet.toJSON())} with ${JSON.stringify(
          newWalletData
        )}`
      );
      await wallet.save(); // Save the changes
      return {
        message: "Reward wallet updated successfully",
        data: newWalletData,
      };

    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        // Si se detecta un error de duplicado, se lanza un error conflict (409) con boom
        throw boom.conflict("El address ya existe", error);
      }
      console.error("Error updating reward wallet:", error);
      throw error;
    }

  }

  async deleteRewardWallet(userId: string): Promise<Record<string, any>> {
    try {
      const wallet = await Wallet.findOne({
        where: {
          id: userId,
        },
      });

      if (!wallet) throw boom.notFound("Wallet not found", userId);

      await wallet.destroy().catch((error) => {
        console.error("Error deleting wallet:", error);
        throw boom.internal("Error deleting wallet", error.message);
      });

      return {
        message: "Reward wallet deleted successfully",
        data: wallet,
      };
    } catch (error) { 
      console.error("Error deleting reward wallet:", error);
      throw error;
    }
    
  }


  async getRewardWalletByAddress(walletAddress: string): Promise<any> {
    try {
      const wallet = await Wallet.findOne({
        where: {
          address: walletAddress,
        },
      })

      //if (!wallet) throw new Error("Wallet not found");
      if (!wallet) throw boom.notFound("Wallet not found",  walletAddress );
      
      return {
        message: "Reward wallet fetched successfully",
        data: wallet,
      }
    } catch (error) {
      console.error("Error fetching reward wallet by address:", error);
      throw error;
    }

  }
}

export default new RewardWalletService;