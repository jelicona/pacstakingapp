import { getPacviewerData } from "../../helpers/pacviewer.helper";
import boom from "@hapi/boom";
import { pacViewerEndpoint } from "../../types/data.type";


class GetRewardBalance {

    constructor(readonly rewardWallet: string|undefined) {
        
        rewardWallet ? this.rewardWallet = rewardWallet
            : this.rewardWallet = process.env.REWARD_ADD;
    }

    getBalance = async () => {
        
        const baseUrl = process.env.PACVIEWER_BASEURL;

        try {
            const walletPath = getPacviewerData({
                wallet: this.rewardWallet,
                endpoint: pacViewerEndpoint.getbalance
            })

            const pacviewer_path = baseUrl + walletPath;
            
            console.log("PACVIEWER URL: ", pacviewer_path)
            const result = await fetch(pacviewer_path)

            const walletData = await result.json()
            console.log(walletData)
            return walletData;

                
        } catch (err: any) {
            throw boom.internal("Error getting wallet balance from pacviewer", err.message)
        }
  }

}


export default GetRewardBalance