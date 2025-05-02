import { IValidatorInterface } from '../../interfaces/validator.interface';

class GetValidator {

    public validators: Record<string, IValidatorInterface> = {};
    
    constructor() {

    }
  

    public async init() { 
        this.validators = await this.getAllValidators();
    }

    public async getAllValidators() {
        try {
            const validators = await fetch(process.env.SERVICE_HOST || '')
            return await validators.json();
        } catch (error) {
            console.error('Error fetching validators:', error);
            throw new Error('Error fetching validators');
        }
    }

    public async findAll() {
        try {
            return await this.validators;
        } catch (error) {
            console.error('Error fetching all validators:', error);
            throw new Error('Error fetching all validators');
        }
    }

    public async findOne(id: string) { 
        try {
            let name = `VALIDATOR_ADDRESS_${id}`;
            let validator = this.validators[name];
            return {name, validator}
        } catch (error) {
            console.error('Error fetching validator:', error);
            throw new Error('Error fetching validator');
        }
    }

    public async updateValidators() { 
        try {
            const validators = await this.findAll();
            this.validators = validators;
        } catch (error) {
            console.error('Error updating validators:', error);
            throw new Error('Error updating validators');
        }
    }

}

export default new GetValidator();