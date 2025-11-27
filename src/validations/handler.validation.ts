import Joi from "joi";
import { HandlerType } from "../types/handler/handlerRewards.type";

const validHanlderTypes: HandlerType[] = [
  "rewards",
  "config",
  "validators",
  "metrics",
  "notifications",
];

const handlerBodySchema: Joi.ObjectSchema<any> = Joi.object({
  id: Joi.number().required(),
  config: Joi.object().required(),
});

const handlerParamsSchema: Joi.ObjectSchema<any> = Joi.object({
  type: Joi.string()
    .valid(...validHanlderTypes)
    .required(),
});

const handlerSchema: Joi.ObjectSchema<any> = Joi.object({
  body: handlerBodySchema,
  param: handlerParamsSchema, // Cambiado de 'param' para que coincida con el objeto que validas
});

export { handlerSchema };
