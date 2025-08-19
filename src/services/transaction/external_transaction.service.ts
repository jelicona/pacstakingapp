import Transaction from "../../models/transaction";
import Wallet from "../../models/wallet";
import boom from "@hapi/boom";
import GetRewardBalance from "../global/getrewardbalance.service";
import { where } from "sequelize";
import { Boom } from "@hapi/boom";

class ExternalTransactionService {
  private originBalance: any;
  private pactTxService = `${process.env.SERVICE_TX_HOST}withdraw/tx`;

  constructor(private readonly balance: number) {
    this.originBalance = balance;
  }

  setTxTransaction = async (amount: number, destAddr: string, memo?: string) => {
    try {
      if (amount > this.originBalance / 1e9)
        throw boom.conflict("amount cant be higher than balance");

      console.log(this.pactTxService);

      const txPact = await fetch(this.pactTxService, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originWallet: process.env.REWARD_ADD,
          destinyWallet: destAddr,
          amount,
          memo,
        }),
      });

      const txSend = await Transaction.create({
        type: "TRANSFER",
        source_wallet: process.env.REWARD_ADD,
        dest_wallet: destAddr,
        amount,
        status_path: "Transfered",
        programmed: false,
        from_walletid: await Wallet.findOne({
          where: { address: process.env.REWARD_ADD },
        }).then((wallet) => wallet?.id),
        to_walletid: null,
      });

      const resTxPact = await txPact.json();

      console.log("TX RESULT: ", resTxPact);
      return resTxPact;
    } catch (err: any) {
      throw err;
    }
  };
}

export default ExternalTransactionService;