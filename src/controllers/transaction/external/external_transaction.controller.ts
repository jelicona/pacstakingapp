import { Request, Response, NextFunction } from "express";
import GetRewardBalance from "../../../services/global/getrewardbalance.service";
import ExternalTransactionService from "../../../services/transaction/external_transaction.service";

const txTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { originWallet, destWallet, amount, memo } = req.body;

    const availablePac = await new GetRewardBalance(originWallet).getBalance();

      const transaction = await new ExternalTransactionService(availablePac.data);

      const txResult = (memo) ? await transaction.setTxTransaction(amount, destWallet, memo)
          : await transaction.setTxTransaction(amount, destWallet);

    console.log("AVAILABLE PAC FROM PACVIEWER IS: ", availablePac);

    res.status(200).json({ txResult, status: "ok" });
  } catch (err: any) {
    next(err);
  }
};

const txTriggerTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

  } catch (err: any) {
    next(err);
  }
};

export { txTransaction, txTriggerTransaction };