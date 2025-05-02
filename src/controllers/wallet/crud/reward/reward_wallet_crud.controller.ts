import Wallet from "../../../../models/wallet";
import { IRewardInterface } from "../../../../interfaces/reward.interface";
import { Request, Response } from "express";
import RewardWalletService from "../../../../services/wallet/reward_wallet.service";
import { get } from 'mongoose';

const getRewardWallet = async (req: Request, res: Response) => {
    try { 
        const walletAddress = req.body.address;
        const wallet = await RewardWalletService.getRewardWalletByAddress(walletAddress);
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        return res.status(200).json({
            messgage: wallet.message,
            data: wallet.data,
        });
    } catch (error: any) {
            console.error("Error getting reward wallet:", error);
            return res.status(500).json({ error: error.message });
        }
}

const createRewardWallet = async (req: Request, res: Response) => {
    try {
        const data = req.body as IRewardInterface;
        const createWallet = await RewardWalletService.addRewardWallet(data);
        return res.status(201).json({
            message: "Reward wallet created successfully",
            data: createWallet,
        });

    } catch (error: any) {   
        console.error("Error creating reward wallet:", error);

        // Manejar errores específicos de Sequelize
        if (error.message.includes("Wallet already exists")) {
          return res.status(409).json({ message: error.message }); // 409 Conflict
        }

        if (error.message.includes("WHERE parameter") || error.message.includes("notNull Violation")) {
          return res.status(400).json({ message: error.message }); // 400 Bad Request
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateRewardWallet = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const result = await RewardWalletService.updateRewardWallet(data);

    const walletInstance = result.data;
    const updated = walletInstance.dataValues;

    const walletChanges: Record<string, any> = Object.keys(data).reduce(
      (acc: any, key) => {
        if (key in updated) {
          acc[key] = updated[key];
        }
        return acc;
      },
      {}
    );

    return res.status(200).json({
      message: "Reward wallet updated successfully",
      data: walletChanges
    });
      
  } catch (error: any) {
    console.error("Error updating reward wallet:", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteRewardWallet = async (req: Request, res: Response) => {
    try {
        const walletId = req.params.walletId;
        const deletedWallet = await RewardWalletService.deleteRewardWallet(walletId);
        if (!deletedWallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        return res.status(200).json({
            deletedWallet,
        });
    } catch (error: any) {
        console.error("Error deleting reward wallet:", error);
        return res.status(500).json({ error: error.message });
    }
}
    

export { createRewardWallet, updateRewardWallet, deleteRewardWallet, getRewardWallet };