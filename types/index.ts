import { PublicKey } from '@solana/web3.js'

export interface Signer {
  id: string
  publicKey: string
  name: string
  email?: string
  role: 'owner' | 'signer' | 'viewer'
  weight: number
  isActive: boolean
  addedAt: Date
  lastActive?: Date
}

export interface MultiSigWallet {
  id: string
  name: string
  description?: string
  address: string
  threshold: number
  totalWeight: number
  signers: Signer[]
  balance: number
  tokenBalances: TokenBalance[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface TokenBalance {
  mint: string
  symbol: string
  name: string
  balance: number
  decimals: number
  logoURI?: string
}

export interface Transaction {
  id: string
  walletId: string
  type: 'transfer' | 'swap' | 'stake' | 'unstake' | 'mint' | 'burn'
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'expired'
  from: string
  to?: string
  amount: number
  token?: string
  description: string
  signatures: Signature[]
  requiredSignatures: number
  approvedSignatures: number
  rejectedSignatures: number
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  executedAt?: Date
  transactionHash?: string
}

export interface Signature {
  id: string
  transactionId: string
  signerId: string
  signerPublicKey: string
  signerName: string
  status: 'pending' | 'approved' | 'rejected'
  signature?: string
  message?: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionRequest {
  walletId: string
  type: 'transfer' | 'swap' | 'stake' | 'unstake' | 'mint' | 'burn'
  from: string
  to?: string
  amount: number
  token?: string
  description: string
  expiresInHours?: number
}

export interface CreateWalletRequest {
  name: string
  description?: string
  signers: {
    publicKey: string
    name: string
    email?: string
    role: 'owner' | 'signer' | 'viewer'
    weight: number
  }[]
  threshold: number
}

export interface AddSignerRequest {
  walletId: string
  publicKey: string
  name: string
  email?: string
  role: 'owner' | 'signer' | 'viewer'
  weight: number
}

export interface RemoveSignerRequest {
  walletId: string
  signerId: string
}

export interface UpdateThresholdRequest {
  walletId: string
  newThreshold: number
}

export interface User {
  id: string
  publicKey: string
  name: string
  email?: string
  avatar?: string
  wallets: MultiSigWallet[]
  createdAt: Date
  lastActive: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'transaction' | 'signature' | 'wallet' | 'system'
  title: string
  message: string
  isRead: boolean
  data?: any
  createdAt: Date
}

export interface WalletActivity {
  id: string
  walletId: string
  type: 'transaction' | 'signature' | 'signer_added' | 'signer_removed' | 'threshold_updated'
  description: string
  data?: any
  createdAt: Date
}

export interface TransactionTemplate {
  id: string
  name: string
  description: string
  type: 'transfer' | 'swap' | 'stake' | 'unstake' | 'mint' | 'burn'
  defaultAmount?: number
  defaultToken?: string
  isRecurring: boolean
  recurrencePattern?: string
  createdAt: Date
  updatedAt: Date
}

export interface WalletSettings {
  id: string
  walletId: string
  autoApprove: boolean
  requireDescription: boolean
  maxTransactionAmount: number
  allowedTokens: string[]
  notificationPreferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
  securitySettings: {
    require2FA: boolean
    sessionTimeout: number
    maxFailedAttempts: number
  }
}

export interface AuditLog {
  id: string
  walletId: string
  userId: string
  action: string
  details: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export interface WalletStats {
  totalTransactions: number
  pendingTransactions: number
  totalVolume: number
  averageTransactionAmount: number
  mostActiveSigner: string
  lastTransactionDate?: Date
}

export interface NetworkConfig {
  name: string
  rpcUrl: string
  explorerUrl: string
  chainId: string
  isTestnet: boolean
} 