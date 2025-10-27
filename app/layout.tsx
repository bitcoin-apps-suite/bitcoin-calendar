// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SharedLayout from '../src/components/SharedLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitcoin Calendar - Blockchain-based Calendar App',
  description: 'A blockchain-based calendar app with HandCash authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SharedLayout>
          {children}
        </SharedLayout>
      </body>
    </html>
  )
}