import Router from "express";
import * as HandlerController from "../types/handler/handlerRewards.type";
import { validateHandlerRequest } from "../middlewares/validators/handler_validator.middleware";
import { handlerSchema } from "../validations/handler.validation";

const router = Router();

router.get('/', (req, res) => {
    res.send('Handler route');
});

router.post('/:type', validateHandlerRequest(handlerSchema), (req, res) => { res.send(`Handler POST route OK! type is ${req.params.type}`); });

export { router };