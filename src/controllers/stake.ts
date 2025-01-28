import {Request, Response } from "express"
import { getValidatorAddress } from '../services/dashboard'
import { getPacAmountAvailable } from "../services/stake"


const getAvailableStake = async (req: Request, res : Response) => {
    try {
        const validators = await getValidatorAddress()
        const availableStake: any = getPacAmountAvailable(parseInt(req.params.id), validators)
        if (availableStake == -1) res.sendStatus(403).send({message: "Invalid ID"})
        res.send(availableStake)
    } catch (error) {
        res.status(500).send({message: error})
    }
}

export {getAvailableStake}