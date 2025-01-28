import { spawn, exec } from 'child_process';
import { getPacAmountAvailable } from "./stake";
import { validatorInterface } from "../interfaces/validator.interface";
import { promisify } from 'util';

const execAsync = promisify(exec);
// Función para obtener la cantidad disponible
const availablePac = (id:number, validators:validatorInterface) => {
    const validator = getPacAmountAvailable(id, validators);
    const available = validator.reward_address.balance;
    const address = validator.reward_address.address;
    return { address, available };
};

// Función para realizar la retirada
const withdrawPac = async (amount: number | string, address: any) => {

    const walletDir = process.env.PACTUS_WALLET_DIR;
    const xeggexWallet = process.env.XEGGEX_WALLET;


    const command = `${walletDir} tx transfer ${address} ${xeggexWallet} ${amount}`;
    const expectCommand = `expect -c 'spawn ${command}; expect "Wallet password:"; send "godaccaca222\n"; expect "THIS ACTION IS NOT REVERSIBLE"; send "y\n"; interact'`;
    
    try {
      const { stdout, stderr } = await execAsync(expectCommand);
      if (stderr) {
        console.log("Error de wallet al leer balance de address", stderr);
        return "-1"; // Considera devolver algo que indique claramente un error.
      }
      //console.log("Salida comando:", stdout);
      return xeggexWallet; // Utiliza .trim() para eliminar el espacio en blanco del inicio/final.
    } catch (err) {
      console.error("Error al leer balance de address", err);
      return "-1"; // Considera devolver algo que indique claramente un error.
    }
  

};

export { availablePac, withdrawPac };
