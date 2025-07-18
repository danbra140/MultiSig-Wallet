'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { 
  Menu, 
  X, 
  Wallet,
  Users,
  Settings,
  LogOut,
  Bell,
  Plus
} from 'lucide-react'

export const Header = () => {
  const { publicKey, disconnect } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Wallets', href: '/wallets' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Signers', href: '/signers' },
  ]

  const handleDisconnect = async () => {
    await disconnect()
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold gradient-text">MultiSig Wallet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-dark-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-lg bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-colors duration-200">
              <Bell className="w-5 h-5 text-white" />
            </button>

            {/* Create Wallet Button */}
            <Link href="/create-wallet" className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Wallet</span>
            </Link>

            {/* Wallet Button */}
            <WalletMultiButton className="btn-secondary" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-dark-800 border border-dark-700"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-dark-700 bg-dark-900">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu (if connected) */}
            {publicKey && (
              <div className="border-t border-dark-700 pt-4 space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors duration-200"
                >
                  <Users className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-800 rounded-lg transition-colors duration-200 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
} 