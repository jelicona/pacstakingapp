import Joi from 'joi';
import { IWalletInterface } from '../interfaces/wallet.interface';

const walletSchema: Joi.ObjectSchema<IWalletInterface> = Joi.object({
    id: Joi.number().integer().when('$method', {
        is: 'update',
        then: Joi.optional(),
        otherwise: Joi.optional()
    }),
    type: Joi.string().when('$walletType', {
        is: 'reward',
        then: Joi.string().valid('REWARD'),
        otherwise: Joi.string().valid('VALIDATOR')
    }),
    name: Joi.string().alphanum().min(3).max(30).required(),
    address: Joi.string().required(),
    index: Joi.number().integer().required(),
    balance: Joi.number().when('$walletType', {
        is: 'stake',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    staking: Joi.number().integer().when('$walletType', {
        is: 'reward',
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    status: Joi.string().valid('BOND', 'UNBOND', 'PENDING_UNSTAKE').optional(),
});

const walletPropertySchema: Joi.ObjectSchema<IWalletInterface> = Joi.object({
    walletId: Joi.string().when('$method', {
        is: Joi.valid('get', 'delete'),
        then: Joi.optional(),
        otherwise: Joi.required()
    }),
    walletAddress: Joi.string().when('$method', {
        is: Joi.valid('get', 'delete'), 
        then: Joi.required(),
        otherwise: Joi.optional()
    })
})

const updateWalletSchema: Joi.ObjectSchema<IWalletInterface> = Joi.object({
  id: Joi.number().integer().optional(),
  type: Joi.string().optional(),
  name: Joi.string().alphanum().min(3).max(30).optional(),
  address: Joi.string().optional(),
  index: Joi.number().integer().optional(),
  balance: Joi.number().optional(),
  staking: Joi.number().integer().optional(),
  status: Joi.string().valid("BOND", "UNBOND", "PENDING_UNSTAKE").optional(),
});
    
export { walletSchema, walletPropertySchema, updateWalletSchema };
