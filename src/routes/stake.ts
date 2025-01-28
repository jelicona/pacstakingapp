import {Router} from 'express'
import { getAvailableStake } from '../controllers/stake'

const router = Router()

router.get('/', (req, res) => {
    try {
        console.log("Ruta stake accedida")
        res.send("Ruta stake accedida")
    } catch (error) {

    }
})

router.get('/:id', getAvailableStake)

export {router}
