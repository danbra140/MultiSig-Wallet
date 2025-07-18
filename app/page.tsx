'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { WalletOverview } from '@/components/WalletOverview'
import { RecentTransactions } from '@/components/RecentTransactions'
import { QuickActions } from '@/components/QuickActions'
import { WalletStats } from '@/components/WalletStats'
import { useWalletStore } from '@/store/walletStore'
import { 
  Wallet, 
  Users,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function Home() {
  const { 
    wallets, 
    transactions, 
    user, 
    loading, 
    fetchWallets, 
    fetchTransactions 
  } = useWalletStore()

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  useEffect(() => {
    if (wallets.length > 0) {
      fetchTransactions(wallets[0].id)
    }
  }, [wallets, fetchTransactions])

  const pendingTransactions = transactions.filter(t => t.status === 'pending')
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  if (loading && wallets.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Header />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-dark-700 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="wallet-card">
                    <div className="h-16 bg-dark-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                      <div className="h-3 bg-dark-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      {/* Main Content */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Multi-Signature Dashboard</h1>
            <p className="text-dark-300">Manage your collaborative wallets and transactions</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="wallet-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary-500/10">
                  <Wallet className="w-6 h-6 text-primary-400" />
                </div>
                <span className="text-sm text-dark-300">Total Wallets</span>
              </div>
              <p className="text-2xl font-bold text-white">{wallets.length}</p>
              <p className="text-sm text-dark-300">Active wallets</p>
            </div>

            <div className="wallet-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-success-500/10">
                  <TrendingUp className="w-6 h-6 text-success-400" />
                </div>
                <span className="text-sm text-dark-300">Total Balance</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalBalance.toFixed(2)} SOL</p>
              <p className="text-sm text-dark-300">Across all wallets</p>
            </div>

            <div className="wallet-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-warning-500/10">
                  <Clock className="w-6 h-6 text-warning-400" />
                </div>
                <span className="text-sm text-dark-300">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">{pendingTransactions.length}</p>
              <p className="text-sm text-dark-300">Awaiting signatures</p>
            </div>

            <div className="wallet-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-secondary-500/10">
                  <Users className="w-6 h-6 text-secondary-400" />
                </div>
                <span className="text-sm text-dark-300">Total Signers</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {wallets.reduce((sum, wallet) => sum + wallet.signers.length, 0)}
              </p>
              <p className="text-sm text-dark-300">Across all wallets</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Wallet Overview */}
            <div className="lg:col-span-2 space-y-8">
              <WalletOverview wallets={wallets} />
              <RecentTransactions transactions={transactions} />
            </div>

            {/* Right Column - Quick Actions & Stats */}
            <div className="space-y-8">
              <QuickActions />
              <WalletStats wallets={wallets} transactions={transactions} />
            </div>
          </div>

          {/* Alerts */}
          {pendingTransactions.length > 0 && (
            <div className="mt-8 p-4 bg-warning-500/10 border border-warning-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-warning-400" />
                <div>
                  <h3 className="text-warning-400 font-semibold">Pending Transactions</h3>
                  <p className="text-dark-300">
                    You have {pendingTransactions.length} transaction(s) awaiting your signature
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 