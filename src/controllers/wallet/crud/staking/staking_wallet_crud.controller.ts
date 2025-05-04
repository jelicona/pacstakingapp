import Wallet from "../../../../models/wallet";
import { IWalletInterface } from "../../../../interfaces/wallet.interface";
import { NextFunction, Request, Response } from "express";
import StakingWalletService from "../../../../services/wallet/staking_wallet.service";

const getStakingWallet = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const walletAddress = req.body.address;
        const wallet = await StakingWalletService.getStakingWalletByAddress(walletAddress);
        if (!wallet) {
          //return res.status(404).json({ message: "Wallet not found" });
        }
        return res.status(200).json({
            messgage: wallet.message,
            data: wallet.data,
        });
    } catch (error: any) {
            console.error("Error getting Staking wallet:", error);
            next(error);
        }
}

const createStakingWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as IWalletInterface;
    const createWallet = await StakingWalletService.addStakingWallet(data);
    return res.status(201).json({
      message: "Staking wallet created successfully",
      data: createWallet,
    });
  } catch (error: any) {
    console.error("Error creating Staking wallet:", error);
    next(error);
  }
};

const updateStakingWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const result = await StakingWalletService.updateStakingWallet(data);

    const walletInstance = result.data;
    const updated = walletInstance.dataValues;

    const walletChanges: Record<string, any> = Object.keys(data).reduce(
      (acc: any, key) => {
        if (key in updated) {
          acc[key] = updated[key];
        }
        return acc;
      }, {});

    return res.status(200).json({
      message: "Staking wallet updated successfully",
      data: walletChanges,
    });
  } catch (error: any) {
    console.error("Error updating Staking wallet:", error);
    next(error);
  }
};

const deleteStakingWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const walletId = req.params.walletId;
    const deletedWallet = await StakingWalletService.deleteStakingWallet(
      walletId
    );
    if (!deletedWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    return res.status(200).json({
      deletedWallet,
    });
  } catch (error: any) {
    console.error("Error deleting Staking wallet:", error);
    next(error);
  }
};
    

export { createStakingWallet, updateStakingWallet, deleteStakingWallet, getStakingWallet };