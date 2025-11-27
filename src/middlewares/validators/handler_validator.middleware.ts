import { Request, Response, NextFunction, RequestHandler } from "express";
import Boom from "@hapi/boom";
import { ObjectSchema, ValidationError } from "joi";

export function validateHandlerRequest(schema: ObjectSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const handlerType = req.params.type;

    // Construir el objeto a validar con la estructura esperada por el schema de JOI
    const dataToValidate = {
      body: req.body,
      param: { type: handlerType },
    };

    const { error, value }: { error?: ValidationError; value: any } =
      schema.validate(dataToValidate);

    console.log("VALIDATION VALUE: ", value);
    console.log("VALIDATION ERROR: ", error);

    if (error) {
      throw Boom.badRequest(
        `Validation error in handler type ${handlerType}`,
        error.details
      );
    }

    // Asignar los valores validados
    req.body = value.body;
    req.params.type = value.param.type;

    next();
  };
}
