'use client'

// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import { useState, useEffect } from 'react'
import CalendarPage from '../src/pages/CalendarPage'
import { useBitcoinOS } from '../src/utils/useBitcoinOS'
import '../src/App.css'

export default function Home() {
  const { setTitle } = useBitcoinOS()
  const [isMobile, setIsMobile] = useState(false)
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false)

  useEffect(() => {
    setTitle('Bitcoin Calendar')
  }, [setTitle])

  useEffect(() => {
    setDevSidebarCollapsed(localStorage.getItem('devSidebarCollapsed') === 'true')
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <CalendarPage devSidebarCollapsed={devSidebarCollapsed} isMobile={isMobile} />
}
