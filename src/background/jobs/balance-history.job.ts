import { BalanceHistoryService } from '../../services/wallet/history/wallet_history.service';
import { JobResult, BalanceHistoryJobData } from '../../types/jobs/job.types'
import GetRewardBalance from '../../services/global/getrewardbalance.service'
import WalletHistory from '../../models/walletHistory'
import Wallet from '../../models/wallet'
import boom from '@hapi/boom';

export async function executeBalanceHistoryJob(data: BalanceHistoryJobData): Promise<JobResult> {
    const startTime = Date.now();

    try {
        const targetWalletId = data.config?.targetWalletId;
        const jobId = data.jobConfigId;

        if (!jobId) throw boom.conflict("Job Config ID is missing");
        if (!targetWalletId) throw boom.conflict("Target Wallet ID is missing");

        const getWallet: Wallet | null = await Wallet.findOne({ where: { index: targetWalletId }, attributes: ['address'] });
        const wallet: string | undefined = getWallet?.address

        const currentBalance = await new GetRewardBalance(wallet).getBalance();
        
        if (!currentBalance) throw boom.conflict("Could not retrieve current balance");
        if (!wallet) throw boom.conflict("Wallet address is missing");
        await WalletHistory.create({
            walletid: targetWalletId,
            valueatdate: currentBalance.data / 1_000_000_000,
            date_ejecuted: new Date(),
        });

        console.log(`Balance History Job executed successfully for Wallet ID: ${targetWalletId} with balance: ${currentBalance}`);
        
        return {
            success: true,
            message: "Job completed successfully",
            data: { walletBalance: currentBalance },
            executionTime: Date.now() - startTime,
        };

    } catch (err) {
        console.error(`Error executing Balance History Job: ${err}`);
        return {
            success: false,
            message: "Job failed",
            error: err instanceof Error ? err.message : 'Unknown error',
            executionTime: Date.now() - startTime,
        };
    }
} 