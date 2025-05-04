export interface IWalletInterface {
    id: string;
    type: string;
    name: string;
    address: string;
    index?: number;
    balance: number;
    staking?: number;
    status?: null;
}