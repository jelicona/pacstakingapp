export interface IValidatorInterface {
    id: string;
    address: string;
    balance: number;
    stake: string;
    reward_wallet: {
        address: string;
        amount: number;
    }
}

