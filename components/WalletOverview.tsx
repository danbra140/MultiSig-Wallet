'use client'

import { MultiSigWallet } from '@/types'
import { Wallet, Users, Clock, Eye, Settings } from 'lucide-react'
import Link from 'next/link'

interface WalletOverviewProps {
  wallets: MultiSigWallet[]
}

export const WalletOverview = ({ wallets }: WalletOverviewProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  const getStatusColor = (wallet: MultiSigWallet) => {
    if (!wallet.isActive) return 'text-red-400'
    return 'text-success-400'
  }

  const getStatusText = (wallet: MultiSigWallet) => {
    if (!wallet.isActive) return 'Inactive'
    return 'Active'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Your Wallets</h2>
          <p className="text-dark-300">Manage your multi-signature wallets</p>
        </div>
        <Link href="/create-wallet" className="btn-primary">
          Create New Wallet
        </Link>
      </div>

      {wallets.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Wallets Yet</h3>
          <p className="text-dark-300 mb-6">
            Create your first multi-signature wallet to get started
          </p>
          <Link href="/create-wallet" className="btn-primary">
            Create Your First Wallet
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="wallet-card hover:border-primary-500 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-primary-500/10">
                    <Wallet className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white">{wallet.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(wallet)} bg-opacity-20`}>
                        {getStatusText(wallet)}
                      </span>
                    </div>
                    <p className="text-sm text-dark-300 mb-2">
                      {wallet.description || 'No description provided'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-dark-400">
                      <span className="font-mono">{formatAddress(wallet.address)}</span>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{wallet.signers.length} signers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{wallet.threshold}/{wallet.totalWeight} threshold</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-white mb-1">
                    {wallet.balance.toFixed(4)} SOL
                  </p>
                  <p className="text-sm text-dark-300">
                    {wallet.tokenBalances.length} tokens
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Link
                      href={`/wallets/${wallet.id}`}
                      className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Link>
                    <Link
                      href={`/wallets/${wallet.id}/settings`}
                      className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4 text-white" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Token Balances */}
              {wallet.tokenBalances.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <h4 className="text-sm font-medium text-dark-300 mb-2">Token Balances</h4>
                  <div className="flex flex-wrap gap-2">
                    {wallet.tokenBalances.slice(0, 3).map((token) => (
                      <div
                        key={token.mint}
                        className="px-3 py-1 bg-dark-700 rounded-full text-xs"
                      >
                        <span className="text-white">{token.balance.toFixed(2)}</span>
                        <span className="text-dark-300 ml-1">{token.symbol}</span>
                      </div>
                    ))}
                    {wallet.tokenBalances.length > 3 && (
                      <div className="px-3 py-1 bg-dark-700 rounded-full text-xs text-dark-300">
                        +{wallet.tokenBalances.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 