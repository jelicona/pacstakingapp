import { IRewardInterface } from "../../interfaces/reward.interface";
import Wallet from "../../models/wallet";


class RewardWalletService {
  constructor() {
    // Initialize any properties or dependencies here
  }


  // Method to add rewards to the wallet
  async addRewardWallet(params: IRewardInterface): Promise<{message: string, data: Wallet} | undefined> {
      // Logic to add the reward wallet
      try {
          const walletAddress = await Wallet.findOne({
              where: {
                  address: params.address,
              }
          });
          
          if (walletAddress) throw new Error ("Wallet already exists");
    
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
    // Logic to update the user's wallet
    try {
      const walletId = params.id; // Assuming userId is passed in params
      const wallet = await Wallet.findOne({
        where: {
          id: walletId,
        },
        
      });

      if (!wallet) throw new Error("Wallet not found");
    

      const newWalletData = { ...wallet, ...params };
      // Merge existing wallet data with new params
      await Wallet.update(newWalletData, {
        where: {
          id: walletId,
        },
      });
      console.log(`Updated ${wallet} with ${newWalletData}`);
      await wallet.save(); // Save the changes
      return {
        message: "Reward wallet updated successfully",
        data: newWalletData,
      };
    } catch (error) {
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

      if (!wallet) throw new Error("Wallet not found");

      await wallet.destroy();
      return {
        message: "Reward wallet deleted successfully",
        data: wallet,
      };
    } catch (error) { 
      console.error("Error deleting reward wallet:", error);
      throw error;
    }
    
  }
  async getAllRewardWallets(): Promise<any[]> {
    // Logic to fetch all reward wallets
    // This is a placeholder implementation
    return [
      { userId: 'user1', balance: 100 },
      { userId: 'user2', balance: 200 },
    ]; // Replace with actual logic
  }
  async getRewardWalletByAddress(walletAddress: string): Promise<any> {
    try {
      const wallet = await Wallet.findOne({
        where: {
          address: walletAddress,
        },
      })

      if (!wallet) throw new Error("Wallet not found");

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