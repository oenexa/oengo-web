export interface DigitalWallet {
  fiatEUR: number;
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
