import { Request, Response, NextFunction, RequestHandler } from 'express';
import boom from '@hapi/boom';
import { ObjectSchema, ValidationError } from 'joi';

const walletValidation = (schema: ObjectSchema,method: string, walletType: string, property: 'body' | 'query' | 'params' = 'body' ): RequestHandler => { 
    
    return (req: Request, res: Response, next: NextFunction) => {
            
        //if (method == 'update') return next()
        
            const { error, value }: { error?: ValidationError; value: any } = schema.validate(req[property], { context: { method, walletType } }) //{method} == {method: method}
            console.log("VALIDATION VALUE: ", value);
            console.log("VALIDATION ERROR: ", error);

            if (error) return next(boom.badRequest(error.details[0].message, error.details));


            req[property] = value;
            next();
        }

}

export { walletValidation };