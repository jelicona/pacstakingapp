import { Router } from 'express';
import * as BondTxController from '../controllers/transaction/internal/internal_transaction.controller';
import * as ExternalTxController from '../controllers/transaction/external/external_transaction.controller';    

const router = Router();

router.get('/', (req, res) => {
    res.send('Transaction route');
});

router.post("/internal/bond", BondTxController.txBondTransacction);
router.post("/external/basictx", ExternalTxController.txTransaction);
router.post("/external/triggertx", ExternalTxController.txTriggerTransaction);

export { router };