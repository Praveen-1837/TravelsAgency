'use client'

import React, { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { AdminRoleProvider } from './context/AdminRoleContext'
import './admin-tokens.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

  return (
    <AdminRoleProvider>
      <div className="admin-dashboard-scope min-h-screen flex antialiased selection:bg-primary selection:text-white">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[var(--admin-color-bg-secondary)]">
          <TopBar onMenuClick={toggleSidebar} />

          {/* Page Content with custom scrollbar */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminRoleProvider>
  )
}
