import GetRewardBalance from "../../global/getrewardbalance.service";
import { Request, Response, NextFunction } from "express";
import WalletHistory from "../../../models/walletHistory";
import Wallet from "../../../models/wallet";
import boom from "@hapi/boom";



class BalanceHistoryService {


    constructor() {
    }
    
    getBalanceHistory = async (time: number, walletAddress: string) => {

            const walletId = (
              await Wallet.findOne({
                where: { address: walletAddress },
                attributes: ["id"],
              })
            )?.id;

            const record = await WalletHistory.findOne({ where: { walletId } });
            const lastDate = record?.date_ejecuted;
            const valueAtDate = record?.valueatdate;
            
            if (!walletId) throw boom.notFound("Wallet not found");
            if (!lastDate || !valueAtDate) throw boom.notFound("No balance history found for this wallet");
            return { lastDate, valueAtDate };
    }


    setBalanceHistory = async (walletAddress: string) => {
        try {
    
            if (!walletAddress) throw boom.badRequest("Wallet address is required");

            const walletid = (await Wallet.findOne({
                where: { address: walletAddress },
            }))?.id


            const balanceService = new GetRewardBalance(walletAddress);
            const balance = await balanceService.getBalance();

            const walletHistory = await WalletHistory.create({
                walletid ,
                valueatdate: balance.data,
                date_ejecuted: new Date(),
            });

            return walletHistory;

        } catch (err: any) {
            throw boom.internal("Failed to create wallet balance history record", err.message)
        }
    }

    setFrecuency = async (frecuency: number) => {
        try {
            // AGREGAR LOGICA CON WORKER
        } catch (err: any) {

        }
    }
}
export { BalanceHistoryService };