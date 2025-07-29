import React from 'react'
import { BottomNavigation } from './BottomNavigation'

interface MobileLayoutProps {
  children: React.ReactNode
  showBottomNav?: boolean
}

export function MobileLayout({ children, showBottomNav = true }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className={showBottomNav ? 'mobile-safe-area' : ''}>
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}