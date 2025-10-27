'use client'

import React, { useState, useEffect } from 'react'
import { GoogleAuthProvider } from './GoogleAuth'
import DevSidebar from './DevSidebar'
import CleanTaskbar from './CleanTaskbar'
import DockManager from './DockManager'
import ServiceWorkerRegistration from './ServiceWorkerRegistration'
import { HandCashService, HandCashUser } from '../services/HandCashService'

interface SharedLayoutProps {
  children: React.ReactNode
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(true) // Default to collapsed for SSR
  const [isMobile, setIsMobile] = useState(false) // Default to desktop for SSR
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null)
  const [showAIChat, setShowAIChat] = useState(false)
  
  // Check if running in Bitcoin OS
  const isInOS = typeof window !== 'undefined' && (window as any).BitcoinOS

  // Handle window resize and hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize client-side values after hydration
      const saved = localStorage.getItem('devSidebarCollapsed')
      setDevSidebarCollapsed(saved === 'true')
      setIsMobile(window.innerWidth <= 768)
      setIsHydrated(true)
      
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768)
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Initialize HandCash service
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initHandCash = async () => {
        try {
          const handCashService = new HandCashService()
          const user = handCashService.getCurrentUser()
          if (user) {
            setCurrentUser(user)
            setIsAuthenticated(true)
          }
        } catch (error) {
          console.log('HandCash not authenticated:', error)
        }
      }
      
      initHandCash()
    }
  }, [])

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    const handCashService = new HandCashService()
    handCashService.logout()
  }

  return (
    <GoogleAuthProvider>
      <ServiceWorkerRegistration />
      
      {/* Developer Sidebar - Desktop Only */}
      {!isMobile && !isInOS && (
        <DevSidebar onCollapsedChange={setDevSidebarCollapsed} />
      )}
      
      {/* Calendar taskbar - always visible */}
      <CleanTaskbar
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNewDocument={() => {
          // Handle new document
        }}
        onSaveDocument={() => {
          const saveBtn = document.querySelector('.save-btn-mobile, [title*="Save"]') as HTMLElement
          saveBtn?.click()
        }}
        onOpenTokenizeModal={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('openTokenizeModal'))
          }
        }}
        onOpenTwitterModal={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('openTwitterModal'))
          }
        }}
        onToggleAIChat={() => setShowAIChat(!showAIChat)}
      />
      
      {/* Main content */}
      <div className={`main-content ${isHydrated && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${isHydrated && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        {children}
      </div>
      
      {/* Dock Manager - Only show when not running in Bitcoin OS */}
      {!isInOS && <DockManager />}
    </GoogleAuthProvider>
  )
}

export default SharedLayout