import {validatorInterface} from "../interfaces/validator.interface"


const getPacAmountAvailable = (id: number, validators: any) => {
    let validator:any  = {}
    let validatorInfo:validatorInterface;

    if ((Object.keys(validators).length) < id) return -1

    for (let key in validators) {
        if (parseInt(validators[key].id) === id) {
            validator = validators[key]
        }
    }
    console.log("Validador: ", validator)
    validatorInfo = validator;
    return validator
}

export {getPacAmountAvailable}