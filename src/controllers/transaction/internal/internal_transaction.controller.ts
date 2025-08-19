import { Request, Response, NextFunction } from "express";
import GetRewardBalance from "../../../services/global/getrewardbalance.service";
import InternalTransactionService from "../../../services/transaction/internal_transaction.service";





const txBondTransacction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const { originWallet, destWallet, amount } = req.body;

    const availablePac = await new GetRewardBalance(originWallet).getBalance();

    const transaction = await new InternalTransactionService(availablePac.data);

    const bondResult = await transaction.setBondTransaction(amount, destWallet);

    console.log("AVAILABLE PAC FROM PACVIEWER IS: ", availablePac);

    res.status(200).json({ bondResult, status: "ok" });

    //res.status(200).json({message: `available pactus from ${originWallet} is ${availablePac.data/1e9}`})
  } catch (err: any) {
    next(err);
  }
};

const txUnboundTransacction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export {txUnboundTransacction,txBondTransacction}