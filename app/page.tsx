'use client'

// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import { useState, useEffect } from 'react'
import { BlockchainDocumentService, BlockchainDocument } from '../src/services/BlockchainDocumentService'
import { HandCashService, HandCashUser } from '../src/services/HandCashService'
import UnifiedAuth from '../src/components/UnifiedAuth'
import ProofOfConceptBanner from '../src/components/ProofOfConceptBanner'
import CalendarPage from '../src/pages/CalendarPage'
import { useBitcoinOS } from '../src/utils/useBitcoinOS'
import ServiceWorkerRegistration from '../src/components/ServiceWorkerRegistration'
import LoadingDoor from '../src/components/LoadingDoor'
import '../src/App.css'

export default function Home() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null)
  const [handcashService, setHandcashService] = useState<HandCashService | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { isInOS, setTitle } = useBitcoinOS()
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null)
  const [googleUser, setGoogleUser] = useState<any>(null)
  const [showAIChat, setShowAIChat] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoadingDoor, setShowLoadingDoor] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<BlockchainDocument | null>(null)
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed')
      return saved === 'true'
    }
    return false
  })
  const [isMobile, setIsMobile] = useState(false)

  // Handle window resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768)
      
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768)
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Set loading door state on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasShownDoor = sessionStorage.getItem('hasShownLoadingDoor')
      setShowLoadingDoor(!hasShownDoor)
    }
  }, [])

  // Set app title in Bitcoin OS
  useEffect(() => {
    setTitle('Bitcoin Calendar')
  }, [setTitle])

  // Initialize HandCash service on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const service = new HandCashService()
      setHandcashService(service)
    }
  }, [])

  // Initialize services and authentication
  useEffect(() => {
    if (!handcashService) return
    
    const initializeApp = async () => {
      try {
        // Check if user is already authenticated
        const user = handcashService.getCurrentUser()
        if (user) {
          setCurrentUser(user)
          setIsAuthenticated(true)
          
          // Initialize document service with authenticated user
          const docService = new BlockchainDocumentService(handcashService)
          setDocumentService(docService)
        }
        
        // Check for Google authentication
        const googleAuthData = localStorage.getItem('googleAuth')
        if (googleAuthData) {
          try {
            const parsed = JSON.parse(googleAuthData)
            setGoogleUser(parsed)
          } catch (e) {
            console.error('Error parsing Google auth data:', e)
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [handcashService])

  const handleLogout = () => {
    // Use HandCash service logout
    handcashService?.logout()
    
    // Clear EVERYTHING
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
    }
    
    // Reset state
    setIsAuthenticated(false)
    setCurrentUser(null)
    setDocumentService(null)
    setCurrentDocument(null)
    
    console.log('Logout complete - refreshing page...')
    
    // Force hard reload to clear all memory
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.replace('/')
      }
    }, 100)
  }

  return (
    <>
      <ServiceWorkerRegistration />
      {/* Loading Door Animation - Only on first visit */}
      {showLoadingDoor && (
        <LoadingDoor onComplete={() => {
          setShowLoadingDoor(false)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('hasShownLoadingDoor', 'true')
          }
        }} />
      )}
      
      {/* Proof of Concept Banner - positioned at the very top */}
      {!isInOS && <ProofOfConceptBanner />}
      
      {/* Main Calendar Page Content */}
      {isLoading ? (
        <div className="App">
          <div className="loading">Loading Bitcoin Calendar...</div>
        </div>
      ) : (
        <CalendarPage 
          isAuthenticated={isAuthenticated} 
          currentUser={currentUser} 
          devSidebarCollapsed={devSidebarCollapsed} 
          isMobile={isMobile} 
        />
      )}
    </>
  )
}