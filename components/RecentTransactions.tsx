'use client'

import { Transaction } from '@/types'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Play } from 'lucide-react'
import Link from 'next/link'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatAmount = (amount: number, token?: string) => {
    return `${amount.toFixed(4)} ${token || 'SOL'}`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-400" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success-400" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-danger-400" />
      case 'executed':
        return <Play className="w-4 h-4 text-primary-400" />
      default:
        return <Clock className="w-4 h-4 text-dark-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'approved':
        return 'status-approved'
      case 'rejected':
        return 'status-rejected'
      case 'executed':
        return 'status-executed'
      default:
        return 'status-pending'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-primary-400" />
      case 'swap':
        return <ArrowDownLeft className="w-4 h-4 text-secondary-400" />
      default:
        return <ArrowUpRight className="w-4 h-4 text-dark-400" />
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Recent Transactions</h2>
          <p className="text-dark-300">Latest multi-signature transactions</p>
        </div>
        <Link href="/transactions" className="btn-outline">
          View All
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Transactions</h3>
          <p className="text-dark-300">
            Transactions will appear here once you create them
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-700">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-white capitalize">
                        {transaction.type}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-sm text-dark-300 mb-1">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-dark-400">
                      <span>From: {formatAddress(transaction.from)}</span>
                      {transaction.to && (
                        <span>To: {formatAddress(transaction.to)}</span>
                      )}
                      <span>
                        {transaction.approvedSignatures}/{transaction.requiredSignatures} signatures
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-white mb-1">
                    {formatAmount(transaction.amount, transaction.token)}
                  </p>
                  <p className="text-xs text-dark-300 mb-2">
                    {formatDate(transaction.createdAt)}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className="text-xs text-dark-300">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Pending Transactions */}
              {transaction.status === 'pending' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-dark-300 mb-1">
                    <span>Signatures Progress</span>
                    <span>
                      {transaction.approvedSignatures}/{transaction.requiredSignatures}
                    </span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(transaction.approvedSignatures / transaction.requiredSignatures) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons for Pending Transactions */}
              {transaction.status === 'pending' && (
                <div className="mt-3 flex items-center space-x-2">
                  <button className="btn-success text-xs px-3 py-1">
                    Approve
                  </button>
                  <button className="btn-danger text-xs px-3 py-1">
                    Reject
                  </button>
                  <Link
                    href={`/transactions/${transaction.id}`}
                    className="btn-outline text-xs px-3 py-1"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 