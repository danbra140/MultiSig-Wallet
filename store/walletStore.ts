import { create } from 'zustand'
import { 
  MultiSigWallet, 
  Transaction, 
  Signer, 
  User, 
  Notification,
  WalletStats,
  CreateWalletRequest,
  TransactionRequest,
  AddSignerRequest
} from '@/types'

interface WalletStore {
  // State
  wallets: MultiSigWallet[]
  currentWallet: MultiSigWallet | null
  transactions: Transaction[]
  user: User | null
  notifications: Notification[]
  loading: boolean
  error: string | null
  
  // Actions
  createWallet: (request: CreateWalletRequest) => Promise<void>
  addSigner: (request: AddSignerRequest) => Promise<void>
  removeSigner: (walletId: string, signerId: string) => Promise<void>
  createTransaction: (request: TransactionRequest) => Promise<void>
  approveTransaction: (transactionId: string, signerId: string) => Promise<void>
  rejectTransaction: (transactionId: string, signerId: string, reason?: string) => Promise<void>
  executeTransaction: (transactionId: string) => Promise<void>
  setCurrentWallet: (wallet: MultiSigWallet | null) => void
  fetchWallets: () => Promise<void>
  fetchTransactions: (walletId: string) => Promise<void>
  clearError: () => void
}

// Mock data for development
const mockUser: User = {
  id: '1',
  publicKey: '0x1234...5678',
  name: 'John Doe',
  email: 'john@example.com',
  wallets: [],
  createdAt: new Date('2024-01-01'),
  lastActive: new Date(),
}

const mockWallets: MultiSigWallet[] = [
  {
    id: '1',
    name: 'Team Treasury',
    description: 'Main treasury wallet for team operations',
    address: '0xabcd...efgh',
    threshold: 2,
    totalWeight: 3,
    balance: 15.5,
    tokenBalances: [
      {
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        balance: 15.5,
        decimals: 9,
      },
      {
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 5000,
        decimals: 6,
      },
    ],
    signers: [
      {
        id: '1',
        publicKey: '0x1234...5678',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'owner',
        weight: 1,
        isActive: true,
        addedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        publicKey: '0x8765...4321',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'signer',
        weight: 1,
        isActive: true,
        addedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        publicKey: '0x9876...5432',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'signer',
        weight: 1,
        isActive: true,
        addedAt: new Date('2024-01-03'),
      },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    name: 'Marketing Budget',
    description: 'Wallet for marketing and advertising expenses',
    address: '0xdefg...hijk',
    threshold: 1,
    totalWeight: 2,
    balance: 8.2,
    tokenBalances: [
      {
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        balance: 8.2,
        decimals: 9,
      },
    ],
    signers: [
      {
        id: '4',
        publicKey: '0x1234...5678',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'owner',
        weight: 1,
        isActive: true,
        addedAt: new Date('2024-01-01'),
      },
      {
        id: '5',
        publicKey: '0x8765...4321',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'signer',
        weight: 1,
        isActive: true,
        addedAt: new Date('2024-01-02'),
      },
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date(),
    isActive: true,
  },
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    walletId: '1',
    type: 'transfer',
    status: 'pending',
    from: '0xabcd...efgh',
    to: '0x5678...9abc',
    amount: 2.5,
    token: 'SOL',
    description: 'Payment for development services',
    signatures: [
      {
        id: '1',
        transactionId: '1',
        signerId: '1',
        signerPublicKey: '0x1234...5678',
        signerName: 'John Doe',
        status: 'approved',
        createdAt: new Date('2024-01-07T10:00:00'),
        updatedAt: new Date('2024-01-07T10:05:00'),
      },
      {
        id: '2',
        transactionId: '1',
        signerId: '2',
        signerPublicKey: '0x8765...4321',
        signerName: 'Jane Smith',
        status: 'pending',
        createdAt: new Date('2024-01-07T10:10:00'),
        updatedAt: new Date('2024-01-07T10:10:00'),
      },
    ],
    requiredSignatures: 2,
    approvedSignatures: 1,
    rejectedSignatures: 0,
    createdAt: new Date('2024-01-07T10:00:00'),
    updatedAt: new Date('2024-01-07T10:10:00'),
    expiresAt: new Date('2024-01-08T10:00:00'),
  },
  {
    id: '2',
    walletId: '1',
    type: 'transfer',
    status: 'executed',
    from: '0xabcd...efgh',
    to: '0xdef0...1234',
    amount: 1000,
    token: 'USDC',
    description: 'Monthly team salary distribution',
    signatures: [
      {
        id: '3',
        transactionId: '2',
        signerId: '1',
        signerPublicKey: '0x1234...5678',
        signerName: 'John Doe',
        status: 'approved',
        createdAt: new Date('2024-01-06T09:00:00'),
        updatedAt: new Date('2024-01-06T09:05:00'),
      },
      {
        id: '4',
        transactionId: '2',
        signerId: '2',
        signerPublicKey: '0x8765...4321',
        signerName: 'Jane Smith',
        status: 'approved',
        createdAt: new Date('2024-01-06T09:10:00'),
        updatedAt: new Date('2024-01-06T09:15:00'),
      },
    ],
    requiredSignatures: 2,
    approvedSignatures: 2,
    rejectedSignatures: 0,
    createdAt: new Date('2024-01-06T09:00:00'),
    updatedAt: new Date('2024-01-06T09:20:00'),
    expiresAt: new Date('2024-01-07T09:00:00'),
    executedAt: new Date('2024-01-06T09:20:00'),
    transactionHash: '0xabc123...def456',
  },
]

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'transaction',
    title: 'New Transaction Request',
    message: 'A new transaction requires your signature',
    isRead: false,
    data: { transactionId: '1' },
    createdAt: new Date('2024-01-07T10:00:00'),
  },
  {
    id: '2',
    userId: '1',
    type: 'signature',
    title: 'Transaction Approved',
    message: 'Transaction #2 has been approved and executed',
    isRead: true,
    data: { transactionId: '2' },
    createdAt: new Date('2024-01-06T09:20:00'),
  },
]

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallets: [],
  currentWallet: null,
  transactions: [],
  user: null,
  notifications: [],
  loading: false,
  error: null,

  createWallet: async (request: CreateWalletRequest) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newWallet: MultiSigWallet = {
        id: Date.now().toString(),
        name: request.name,
        description: request.description,
        address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
        threshold: request.threshold,
        totalWeight: request.signers.reduce((sum, signer) => sum + signer.weight, 0),
        balance: 0,
        tokenBalances: [],
        signers: request.signers.map((signer, index) => ({
          id: (Date.now() + index).toString(),
          publicKey: signer.publicKey,
          name: signer.name,
          email: signer.email,
          role: signer.role,
          weight: signer.weight,
          isActive: true,
          addedAt: new Date(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }
      
      set(state => ({
        wallets: [...state.wallets, newWallet],
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to create wallet', loading: false })
    }
  },

  addSigner: async (request: AddSignerRequest) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newSigner: Signer = {
        id: Date.now().toString(),
        publicKey: request.publicKey,
        name: request.name,
        email: request.email,
        role: request.role,
        weight: request.weight,
        isActive: true,
        addedAt: new Date(),
      }
      
      set(state => ({
        wallets: state.wallets.map(wallet => 
          wallet.id === request.walletId 
            ? {
                ...wallet,
                signers: [...wallet.signers, newSigner],
                totalWeight: wallet.totalWeight + request.weight,
                updatedAt: new Date(),
              }
            : wallet
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to add signer', loading: false })
    }
  },

  removeSigner: async (walletId: string, signerId: string) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => ({
        wallets: state.wallets.map(wallet => 
          wallet.id === walletId 
            ? {
                ...wallet,
                signers: wallet.signers.filter(signer => signer.id !== signerId),
                totalWeight: wallet.signers
                  .filter(signer => signer.id !== signerId)
                  .reduce((sum, signer) => sum + signer.weight, 0),
                updatedAt: new Date(),
              }
            : wallet
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to remove signer', loading: false })
    }
  },

  createTransaction: async (request: TransactionRequest) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const wallet = get().wallets.find(w => w.id === request.walletId)
      if (!wallet) throw new Error('Wallet not found')
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        walletId: request.walletId,
        type: request.type,
        status: 'pending',
        from: request.from,
        to: request.to,
        amount: request.amount,
        token: request.token,
        description: request.description,
        signatures: wallet.signers.map(signer => ({
          id: `${Date.now()}-${signer.id}`,
          transactionId: Date.now().toString(),
          signerId: signer.id,
          signerPublicKey: signer.publicKey,
          signerName: signer.name,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        requiredSignatures: wallet.threshold,
        approvedSignatures: 0,
        rejectedSignatures: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + (request.expiresInHours || 24) * 60 * 60 * 1000),
      }
      
      set(state => ({
        transactions: [newTransaction, ...state.transactions],
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to create transaction', loading: false })
    }
  },

  approveTransaction: async (transactionId: string, signerId: string) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => ({
        transactions: state.transactions.map(transaction =>
          transaction.id === transactionId
            ? {
                ...transaction,
                signatures: transaction.signatures.map(signature =>
                  signature.signerId === signerId
                    ? { ...signature, status: 'approved', updatedAt: new Date() }
                    : signature
                ),
                approvedSignatures: transaction.signatures.filter(s => s.signerId === signerId).length + 1,
                updatedAt: new Date(),
              }
            : transaction
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to approve transaction', loading: false })
    }
  },

  rejectTransaction: async (transactionId: string, signerId: string, reason?: string) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => ({
        transactions: state.transactions.map(transaction =>
          transaction.id === transactionId
            ? {
                ...transaction,
                status: 'rejected',
                signatures: transaction.signatures.map(signature =>
                  signature.signerId === signerId
                    ? { 
                        ...signature, 
                        status: 'rejected', 
                        message: reason,
                        updatedAt: new Date() 
                      }
                    : signature
                ),
                rejectedSignatures: transaction.rejectedSignatures + 1,
                updatedAt: new Date(),
              }
            : transaction
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to reject transaction', loading: false })
    }
  },

  executeTransaction: async (transactionId: string) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      set(state => ({
        transactions: state.transactions.map(transaction =>
          transaction.id === transactionId
            ? {
                ...transaction,
                status: 'executed',
                executedAt: new Date(),
                transactionHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
                updatedAt: new Date(),
              }
            : transaction
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to execute transaction', loading: false })
    }
  },

  setCurrentWallet: (wallet: MultiSigWallet | null) => {
    set({ currentWallet: wallet })
  },

  fetchWallets: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ wallets: mockWallets, user: mockUser, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch wallets', loading: false })
    }
  },

  fetchTransactions: async (walletId: string) => {
    set({ loading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const walletTransactions = mockTransactions.filter(t => t.walletId === walletId)
      set({ transactions: walletTransactions, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch transactions', loading: false })
    }
  },

  clearError: () => {
    set({ error: null })
  },
})) 