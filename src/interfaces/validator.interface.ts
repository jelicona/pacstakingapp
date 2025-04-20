export interface validatorInterface {
    id: string;
    address: string;
    balance: number;
    stake: number;
    reward_address: {
        address: string;
        balance: number;
    };
};

