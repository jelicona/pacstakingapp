import Wallet from "./wallet";
import WalletHistory from "./walletHistory";

// Definir todas las relaciones aquí
export function initializeAssociations() {
  // Wallet <-> WalletHistory usando index como FK
  Wallet.hasMany(WalletHistory, {
    foreignKey: "walletid", // walletid en WalletHistory
    sourceKey: "index",     // Apunta a wallet.index (no a wallet.id)
    as: "history",
  });

  WalletHistory.belongsTo(Wallet, {
    foreignKey: "walletid", // walletid en WalletHistory
    targetKey: "index",     // Apunta a wallet.index
    as: "wallet",
  });
}
