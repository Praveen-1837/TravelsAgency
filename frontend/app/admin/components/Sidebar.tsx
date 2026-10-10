'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  Compass,
  CreditCard,
  Users2,
  Star,
  ShieldCheck,
  Cpu,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, badge: '19' },
  { name: 'Bookings', href: '/admin/bookings', icon: Compass, badge: '64' },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard, alert: '1' },
  { name: 'Customers', href: '/admin/customers', icon: Users2, badge: '1,248' },
  { name: 'Reviews', href: '/admin/reviews', icon: Star, badge: '3' },
  { name: 'Settings & RBAC', href: '/admin/settings', icon: ShieldCheck },
  { name: 'Integrations', href: '/admin/integrations', icon: Cpu },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 flex flex-col
          transition-all duration-300 ease-in-out font-sans
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          width: '240px',
          backgroundColor: '#1F2937',
          color: '#E5E7EB',
          borderRight: '1px solid #374151',
          height: '100vh',
          flexShrink: 0
        }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4" style={{ height: '60px', borderBottom: '1px solid #374151', flexShrink: 0 }}>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#FF8C00' }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="font-bold text-white tracking-wide" style={{ fontSize: '16px' }}>
              AARIVA <span style={{ color: '#FF8C00' }}>ADMIN</span>
            </div>
          </Link>
          <button className="md:hidden" style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6B7280', padding: '8px 16px', fontWeight: 600 }}>
            Main Menu
          </div>
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: 0, margin: 0, listStyle: 'none' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/admin')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '12px 16px',
                      borderLeft: `3px solid ${isActive ? '#FF8C00' : 'transparent'}`,
                      backgroundColor: isActive ? '#111827' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#E5E7EB',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} style={{ color: isActive ? '#FF8C00' : '#9CA3AF' }} />
                      <span>{item.name}</span>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex items-center gap-1.5">
                      {item.alert && (
                        <span style={{ backgroundColor: '#EF4444', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                          {item.alert}
                        </span>
                      )}
                      {item.badge && (
                        <span style={{ backgroundColor: isActive ? '#374151' : '#111827', color: '#9CA3AF', fontSize: '11px', padding: '2px 6px', borderRadius: '10px' }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer Area */}
        <div style={{ padding: '16px', borderTop: '1px solid #374151', backgroundColor: '#111827', flexShrink: 0 }}>
          <Link
            href="/admin/login"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
