export interface DigitalWallet {
  fiatEUR: number;
  lockedEUR?: number;
  loyaltyPoints: number;
  type: string;
}

export interface CryptoWallet {
  address: string;
  balanceOEN: string;
  type: string;
}

export interface WalletData {
  digital: DigitalWallet;
  crypto: CryptoWallet;
}

export interface CoinProfile {
  userId: string;
  coinBalance: number;
  valueEUR: number;
  totalEarned: number;
  totalSpent: number;
}
