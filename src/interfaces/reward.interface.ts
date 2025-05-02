export interface IRewardInterface {
    id: string;
    type: string;
    name: string;
    address: string;
    index?: number;
    balance: number;
    staking?: number;
    status?: null;
}