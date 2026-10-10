'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Menu,
  Search,
  Bell,
  Activity,
  CreditCard,
  MessageCircle,
} from 'lucide-react'
import { useAdminRole } from '../context/AdminRoleContext'
import { mockIntegrationStatus } from '../_mock/data'

interface TopBarProps {
  onMenuClick: () => void
}

const getPageTitle = (pathname: string) => {
  if (pathname === '/admin') return 'Overview Dashboard'
  if (pathname.includes('/inquiries')) return 'Inquiries & Callback Requests'
  if (pathname.includes('/bookings')) return 'Bookings & Expedition Manifest'
  if (pathname.includes('/payments')) return 'Payments & Settlements'
  if (pathname.includes('/customers')) return 'Customers & CRM Dossiers'
  if (pathname.includes('/reviews')) return 'Reviews & Testimonials'
  if (pathname.includes('/settings')) return 'Settings & Access Governance'
  if (pathname.includes('/integrations')) return 'Integrations & Webhooks'
  return 'Admin Dashboard'
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  const { currentStaff } = useAdminRole()

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', flexDirection: 'column' }}>
      {/* 60px Sticky Header */}
      <header style={{ 
        height: '60px', 
        backgroundColor: '#FFFFFF', 
        borderBottom: '1px solid #E5E7EB', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <button
            className="md:hidden"
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            {pageTitle}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyItems: 'center' }}>
          {/* Quick Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            padding: '8px 12px',
            width: '100%',
            maxWidth: '360px',
            margin: '0 auto'
          }}>
            <Search size={16} style={{ color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Search (⌘K)..."
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                marginLeft: '8px',
                fontSize: '14px',
                width: '100%',
                color: '#111827'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
          <button style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer', color: '#6B7280' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%' }}></span>
          </button>
          
          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', cursor: 'pointer' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FF8C00', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>
               {currentStaff.avatar}
             </div>
          </div>
        </div>
      </header>

      {/* 40px Status Bar */}
      <div style={{
        height: '40px',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        fontSize: '12px',
        color: '#6B7280',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%' }}></span>
           <span>Supabase: {mockIntegrationStatus.supabase.status}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <CreditCard size={12} style={{ color: '#10B981' }} />
           <span>Razorpay: {mockIntegrationStatus.razorpay.status}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
           <Activity size={12} style={{ color: '#10B981' }} />
           <span>Webhooks: {mockIntegrationStatus.webhookHealth.status}</span>
        </div>
      </div>
    </div>
  )
}
