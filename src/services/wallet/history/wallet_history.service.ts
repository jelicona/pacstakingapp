import GetRewardBalance from "../../global/getrewardbalance.service";
import { Request, Response, NextFunction } from "express";
import WalletHistory from "../../../models/walletHistory";
import Wallet from "../../../models/wallet";'
import boom from "@hapi/boom";


class BalanceHistoryService {


    constructor() {
    }
    
    getBalanceHistory = async (time: number, walletAddress: string) => {
        try {

            const walletId = await Wallet.findOne({
                where: { address: walletAddress },
            }).then(wallet => wallet?.id);

            const lastDate = await WalletHistory.findOne({
                where: {
                    walletId
                }
            }).then(date => date?.date_ejecuted);   

            

        }
        catch (err: any) {
            throw boom.internal("Error getting wallet balance history", err.message);
        }
    }


    setBalanceHistory = async (walletAddress: string) => {
        try {
    
            if (!walletAddress) throw boom.badRequest("Wallet address is required");

            const balanceService = new GetRewardBalance(walletAddress);
            const balance = await balanceService.getBalance();

            const walletHistory = await WalletHistory.create({
                wallet_address: walletAddress,
                balance: balance.data,
                timestamp: new Date(),
            });

            res.status(200).json({ balance: balance.data });
        } catch (err: any) {

        }
    }

    setFrecuency = async (frecuency: number) => {
        try {

        } catch (err: any) {

        }
    }
}
export { BalanceHistoryService };