import { Request, Response } from 'express'
import { getValidatorAddress } from '../services/dashboard'


const getValidator = async (req: Request, res: Response) => {
    try {
        const responseValidator = await getValidatorAddress()
        console.log(responseValidator)
        res.send(responseValidator)
    } catch (e: any) {
        res.status(500).send({message: e.message})
    }
}

const postValidator = (req: Request, res: Response) => {
    try {
        const {valid} = req.body;

        res.send(valid)
    } catch (e: any) {
        res.status(500).send({message: e.message})
    }
}

export {getValidator, postValidator}