'use client'

import { MultiSigWallet, Transaction } from '@/types'
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react'

interface WalletStatsProps {
  wallets: MultiSigWallet[]
  transactions: Transaction[]
}

export const WalletStats = ({ wallets, transactions }: WalletStatsProps) => {
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)
  const totalTransactions = transactions.length
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length
  const completedTransactions = transactions.filter(t => t.status === 'executed').length
  const totalVolume = transactions
    .filter(t => t.status === 'executed')
    .reduce((sum, t) => sum + t.amount, 0)

  const mostActiveWallet = wallets.reduce((max, wallet) => {
    const walletTransactions = transactions.filter(t => t.walletId === wallet.id)
    return walletTransactions.length > max.count ? { wallet, count: walletTransactions.length } : max
  }, { wallet: wallets[0], count: 0 })

  const recentActivity = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Wallet Statistics</h2>
        <p className="text-dark-300">Analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-success-500/10">
              <TrendingUp className="w-4 h-4 text-success-400" />
            </div>
            <div>
              <p className="text-sm text-dark-300">Total Volume</p>
              <p className="text-lg font-bold text-white">{totalVolume.toFixed(2)} SOL</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-500/10">
              <Activity className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-dark-300">Total Transactions</p>
              <p className="text-lg font-bold text-white">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-warning-500/10">
              <Clock className="w-4 h-4 text-warning-400" />
            </div>
            <div>
              <p className="text-sm text-dark-300">Pending</p>
              <p className="text-lg font-bold text-white">{pendingTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Status Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Transaction Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-300">Completed</span>
            <span className="text-sm font-medium text-success-400">
              {completedTransactions}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-300">Pending</span>
            <span className="text-sm font-medium text-warning-400">
              {pendingTransactions}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-300">Rejected</span>
            <span className="text-sm font-medium text-danger-400">
              {transactions.filter(t => t.status === 'rejected').length}
            </span>
          </div>
        </div>
      </div>

      {/* Most Active Wallet */}
      {mostActiveWallet.wallet && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Most Active Wallet</h3>
          <div className="p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">{mostActiveWallet.wallet.name}</h4>
              <span className="text-xs text-dark-300">{mostActiveWallet.count} transactions</span>
            </div>
            <p className="text-sm text-dark-300">
              {mostActiveWallet.wallet.balance.toFixed(4)} SOL balance
            </p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-2 bg-dark-700 rounded">
              <div>
                <p className="text-sm font-medium text-white capitalize">
                  {transaction.type}
                </p>
                <p className="text-xs text-dark-300">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white">
                  {transaction.amount.toFixed(2)} {transaction.token || 'SOL'}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === 'executed' ? 'status-executed' :
                  transaction.status === 'pending' ? 'status-pending' :
                  'status-rejected'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 