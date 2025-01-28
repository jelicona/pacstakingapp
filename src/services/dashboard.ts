import {exec} from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const walletDir: string|undefined = process.env.PACTUS_WALLET_DIR;

const getValidatorAddress = async () => {

    const validators = getWallets("VALIDATOR");
    const rewards = getWallets("REWARD");

    const values: any= {};
    //const response = await new Promise(async (resolve: any, reject: any) => {
 // Explicitly define the type of the 'values' object
        for (let key in validators) {
          let index = key.split('_')[2]
          let tmpKey = key.split('_')
          tmpKey[0] = "REWARD"
          tmpKey[2] = index
          let rewardKey = tmpKey.join('_') 
          let rewardBalance = await getBalances(rewards[rewardKey]).then(val => {
            let amt = val.split('\t')
            return parseFloat(amt[0].split(':')[1])
          })

            
           await getBalances(validators[key]).then((value) => {
            let amount = value.split('\t')
            values[key] = {
              id: index,
              address: validators[key],
              balance : parseFloat(amount[0].split(':')[1]),
              stake: parseFloat(amount[1].split(':')[1]),
              reward_address: {
                address: rewards[`REWARD_ADDRESS_${index}`],
                balance: rewardBalance
              }
            }
          });
            ///values[key] = getBalances(validators[key])
        }
     
    //console.log(values)
    return values;
}

const getWallets = (walletType: string) => 
{   const wallets: any = {}
    let i = 1
    do {
        const key = `${walletType}_ADDRESS_${i}`;
        wallets[key] = process.env[key];
        i++;
      } while (process.env[`${walletType}_ADDRESS_${i}`]);

      delete wallets['walletType_ADDRESS_${i}']
      return wallets
}

const getBalances = async (add: string) => {
    try {
      const { stdout, stderr } = await execAsync(`${walletDir} address balance ${add}`);
      if (stderr) {
        console.log("Error de wallet al leer balance de address", stderr);
        return "-1"; // Considera devolver algo que indique claramente un error.
      }
      //console.log("Salida comando:", stdout);
      return stdout.trim(); // Utiliza .trim() para eliminar el espacio en blanco del inicio/final.
    } catch (err) {
      console.error("Error al leer balance de address", err);
      return "-1"; // Considera devolver algo que indique claramente un error.
    }
  };

export {getValidatorAddress}
