import Transaction from "../../models/transaction";
import Wallet from "../../models/wallet"
import boom from "@hapi/boom";
import GetRewardBalance from '../global/getrewardbalance.service';
import { where } from "sequelize";
import { Boom } from '@hapi/boom';

class InternalTransactionService {


    private originBalance: any
    private pactTxService = `${process.env.SERVICE_TX_HOST}stake/bond` 
    
    

    constructor(private readonly balance: number,
    ) {
        this.originBalance = balance
    }

    setBondTransaction = async (amount: number, destAddr: string) => {

        try {
          if (amount > this.originBalance / 1e9)
              throw boom.conflict("amount cant be higher than balance");

            const destWallet = await Wallet.findOne({ where: { address: destAddr } })

            if (parseInt((destWallet?.dataValues?.staking) + amount) > 1000) throw boom.conflict("Validator wallet balance cant be higher than 1000 PAC");

            console.log(this.pactTxService)

            const bondPact = await fetch(this.pactTxService,  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    originWallet: process.env.REWARD_ADD,
                    destinyWallet: destAddr,
                    amount: amount
                }),
            });

            const txBonf = await Transaction.create({
                type: "BOND",
                source_wallet: process.env.REWARD_ADD,
                dest_wallet: destAddr,
                amount,
                status_path: "Bonded",
                programmed: false,
                from_walletid: await Wallet.findOne({ where: { address: process.env.REWARD_ADD } }).then(wallet => wallet?.id),
                to_walletid: await Wallet.findOne({ where: { address: destAddr } }).then(wallet => wallet?.id),
            });

            const resBondPact = await bondPact.json()

            console.log("BOND RESULT: ", resBondPact)
            return resBondPact
        } catch (err: any) {
            throw err
        }
    }

}

export default InternalTransactionService 