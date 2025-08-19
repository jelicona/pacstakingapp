import Router from "express";
import { getBalanceRewards } from "../controllers/data/balancehistory/balance_history.controller";

const router = Router();

router.get('/', getBalanceRewards);

export { router };