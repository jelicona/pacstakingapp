import GetRewardBalance from "../../../services/global/getrewardbalance.service";
import { Request, Response, NextFunction } from "express";
import Boom from "@hapi/boom";

const getBalanceRewards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) throw Boom.badRequest("Wallet address is required");

    const balanceService = new GetRewardBalance(walletAddress);
    const balance = await balanceService.getBalance();

    res.status(200).json({ balance: balance.data });
  } catch (err: any) {
    next(err);
  }
};

const setBalanceRewards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) throw Boom.badRequest("Wallet address is required");

    const balanceService = new GetRewardBalance(walletAddress);
      const balance = await balanceService.getBalance();
      


    res.status(200).json({ balance: balance.data });
  } catch (err: any) {
    next(err);
  }
}



export { getBalanceRewards, setBalanceRewards };