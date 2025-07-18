'use client'

import { Plus, Send, Users, Settings, Shield, History } from 'lucide-react'
import Link from 'next/link'

export const QuickActions = () => {
  const actions = [
    {
      title: 'Create Wallet',
      description: 'Set up a new multi-signature wallet',
      icon: Plus,
      href: '/create-wallet',
      color: 'bg-primary-500/10 text-primary-400',
    },
    {
      title: 'New Transaction',
      description: 'Create a transaction request',
      icon: Send,
      href: '/transactions/new',
      color: 'bg-success-500/10 text-success-400',
    },
    {
      title: 'Manage Signers',
      description: 'Add or remove wallet signers',
      icon: Users,
      href: '/signers',
      color: 'bg-secondary-500/10 text-secondary-400',
    },
    {
      title: 'Wallet Settings',
      description: 'Configure wallet parameters',
      icon: Settings,
      href: '/settings',
      color: 'bg-warning-500/10 text-warning-400',
    },
    {
      title: 'Security',
      description: 'Review security settings',
      icon: Shield,
      href: '/security',
      color: 'bg-danger-500/10 text-danger-400',
    },
    {
      title: 'Transaction History',
      description: 'View all past transactions',
      icon: History,
      href: '/transactions',
      color: 'bg-dark-500/10 text-dark-300',
    },
  ]

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Quick Actions</h2>
        <p className="text-dark-300">Common wallet operations</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="flex items-center space-x-3 p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors duration-200 group"
          >
            <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors duration-200">
                {action.title}
              </h3>
              <p className="text-sm text-dark-300">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 