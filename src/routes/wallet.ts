import { Router } from 'express';
import * as RewardWaleltController from '../controllers/wallet/crud/reward/reward_wallet_crud.controller';

const router = Router();

router.get('/', (req, res) => { 
    res.send('Wallet route');
}
);

router.post("/reward/create",/*asignar middleware validation*/ RewardWaleltController.createRewardWallet);
router.post("/reward/update", RewardWaleltController.updateRewardWallet);
router.delete("/reward/delete/:walletId", RewardWaleltController.deleteRewardWallet);
router.post("/reward/read", RewardWaleltController.getRewardWallet);


export { router };