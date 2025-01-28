import {Router} from 'express';
import { getValidatorCoins, getAllCoins } from '../controllers/withdraw'

const router = Router()

router.get('/', (req, res) => {
    try {
        console.log("Ruta stake accedida")
        res.send("Ruta stake accedida")
    } catch (error) {

    }
})
router.get('/all', getAllCoins)
router.get('/:id', getValidatorCoins)


export {router}

