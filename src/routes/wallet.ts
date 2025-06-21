import { Router } from 'express';
import * as RewardWaleltController from '../controllers/wallet/crud/reward/reward_wallet_crud.controller';
import * as SatkingWaleltController from '../controllers/wallet/crud/staking/staking_wallet_crud.controller';
import { walletValidation } from '../middlewares/validators/wallet_validate.middleware';
import { walletSchema, walletPropertySchema, updateWalletSchema } from '../validations/wallet.validation';


const router = Router();

router.get('/', (req, res) => { 
    res.send('Wallet route');
}
);

router.post("/reward",
    walletValidation(walletSchema, 'create', "reward"),
    //walletValidation(walletPropertySchema, 'post', 'params'),
    RewardWaleltController.createRewardWallet);

router.put("/reward/:walletId",
    walletValidation(updateWalletSchema, 'update', "reward"),

    RewardWaleltController.updateRewardWallet);

router.delete(
  "/reward/:walletId",

  RewardWaleltController.deleteRewardWallet
);
router.get("/reward/:walletAddress?",
    walletValidation(walletPropertySchema, 'get', 'params'),
    RewardWaleltController.getRewardWallet);


router.post("/validator",walletValidation(walletSchema, 'update', "stake"), SatkingWaleltController.createStakingWallet);
router.put("/validator/:walletId", walletValidation(walletSchema, 'create', "stake"), SatkingWaleltController.updateStakingWallet);
router.delete("/validator/:walletId",walletValidation(walletPropertySchema, "delete", "params"),  SatkingWaleltController.deleteStakingWallet);
router.get("/validator/:walletAddress", walletValidation(walletPropertySchema, 'get', 'params'), SatkingWaleltController.getStakingWallet);


export { router };