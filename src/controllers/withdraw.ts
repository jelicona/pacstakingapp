import {Request, Response } from "express"
import {getPacAmountAvailable} from "../services/stake"
import { getValidatorAddress } from '../services/dashboard'
import {availablePac, withdrawPac} from "../services/withdraw"
import Transaction from "../models/transaction"


const getValidatorCoins = async (req: Request, res: Response) => {
    try {
        const validators = await getValidatorAddress();
        const availableCoins: any = await availablePac(parseInt(req.params.id), validators);
        let amount: number | string = req.query.amount as string;
        if (amount !== "ALL") amount = parseFloat(amount);

        if (amount === "ALL") amount = availableCoins.available - 1;
        if (amount <= availableCoins.available) {
            const validatorId: number = parseInt(req.params.id as string);
            console.log("VALIDATORID___: " , validatorId)

            try {
                const wallet = await withdrawPac(amount, availableCoins.address);
                await Transaction.create({
                    validator_id: validatorId,
                    amount
                });
                console.log("Transfered!!!");
                res.send({ status: "Transfered", wallet, amount });
            } catch (e) {
                console.log("ERROR: ", e);
                res.status(500).send({ message: "Error during transaction" });
            }
        } else {
            res.status(400).send({ message: "Insufficient available coins" });
        }
        console.log("Pactus disponible:", availableCoins);
    } catch (error) {
        res.status(500).send({ message: error });
    }
};


const getAllCoins = async (req: Request, res : Response) => {
    console.log("que pustas")
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const sendEvent = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Envía un mensaje inicial
    console.log("Mensaje enviado antes")
    sendEvent({ message: 'Conexión establecida' });
    console.log("Mensaje enviado")
    try {
        const validators = await getValidatorAddress()

        for (let i = 1; i < Object.keys(validators).length + 1; i++) {
            const availableCoins:any = await availablePac(i, validators)
            let amount:number | string = availableCoins.available - 1
            //if (amount != "ALL") amount = 1//parseFloat(amount)/3;
    
            //if (amount == "ALL") amount = availableCoins.available - 1
            if (amount <= availableCoins.available) await withdrawPac(amount, availableCoins.address).then((wallet)=>{
                    console.log({status: "Transfered", wallet, amount})
            })
            console.log("Pactus disponible:", amount)
            console.log("ITERATION: " , i , "length: " , Object.keys(validators).length)
            sendEvent({message: `Transfered ${amount} from ${availableCoins.address} to ${process.env.XEGGEX_WALLET}`})
            if(i == Object.keys(validators).length) {
                sendEvent({message: "All coins transfered"})
                res.end()
            }
        }
        //res.send({message: "All coins transfered"})
    } catch (error) {
        res.status(500).send({message: error})
    }

    req.on('close', () => {
        res.end();
    }); 
}


export {getValidatorCoins, getAllCoins}