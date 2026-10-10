'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AdminRole, ConciergeStaff } from '../types'

interface AdminRoleContextType {
  role: AdminRole
  setRole: (role: AdminRole) => void
  currentStaff: ConciergeStaff
  canAccessFullPII: boolean
  canProcessRefunds: boolean
  canPublishCMS: boolean
  canBroadcastWhatsApp: boolean
  canManageRBAC: boolean
  transactionCap: number
  maskPII: (value: string, type?: 'phone' | 'email' | 'address') => string
}

export const STAFF_PROFILES: Record<AdminRole, ConciergeStaff> = {
  'Super Admin': {
    id: 'staff-01',
    name: 'Devendra Rao',
    role: 'Super Admin',
    email: 'devendra.rao@aarivavoyages.com',
    phone: '+91 98201 44892',
    regional_hub: 'Kashmir',
    two_factor: { enabled: true, method: 'FIDO2' },
    last_pulse: 'Active now',
    status: 'Active',
    avatar: 'DR',
    permissions_tier: 'Tier 0 - Apex Authority',
  },
  'Lead Concierge': {
    id: 'staff-04',
    name: 'Priya Sharma',
    role: 'Lead Concierge',
    email: 'priya.sharma@aarivavoyages.com',
    phone: '+91 98118 77231',
    regional_hub: 'Rajasthan',
    two_factor: { enabled: true, method: 'TOTP' },
    last_pulse: '3m ago',
    status: 'Active',
    avatar: 'PS',
    permissions_tier: 'Tier 2 - Lead Concierge Operations',
  },
  'Finance & Escrow': {
    id: 'staff-08',
    name: 'Meenakshi Sundaram',
    role: 'Finance & Escrow',
    email: 'meenakshi.s@aarivavoyages.com',
    phone: '+91 98402 11985',
    regional_hub: 'Kerala',
    two_factor: { enabled: true, method: 'FIDO2' },
    last_pulse: '12m ago',
    status: 'Active',
    avatar: 'MS',
    permissions_tier: 'Tier 1 - Treasury & Escrow Authority',
  },
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined)

export function AdminRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<AdminRole>('Super Admin')

  useEffect(() => {
    const saved = localStorage.getItem('aariva_demo_role') as AdminRole
    if (saved && STAFF_PROFILES[saved]) {
      setRoleState(saved)
    }
  }, [])

  const setRole = (newRole: AdminRole) => {
    setRoleState(newRole)
    localStorage.setItem('aariva_demo_role', newRole)
  }

  const currentStaff = STAFF_PROFILES[role]

  // RBAC flags based on brief:
  // Super Admin: Full read/write/export PII, Unlimited refund authority, Sanity publish, WhatsApp VIP broadcast, Modify RBAC
  // Lead Concierge: Masked PII, Transaction cap up to ₹5,00,000, Cannot access Finance/RBAC, Sanity draft staging only, Transfer PNR only
  // Finance: Masked PII, Razorpay refunds within policy, cannot view guest dossier private secrets or modify bookings
  const canAccessFullPII = role === 'Super Admin'
  const canProcessRefunds = role === 'Super Admin' || role === 'Finance & Escrow'
  const canPublishCMS = role === 'Super Admin'
  const canBroadcastWhatsApp = role === 'Super Admin'
  const canManageRBAC = role === 'Super Admin'
  const transactionCap = role === 'Super Admin' ? Infinity : role === 'Lead Concierge' ? 500000 : 250000

  const maskPII = (val: string, type: 'phone' | 'email' | 'address' = 'phone'): string => {
    if (canAccessFullPII || !val) return val

    if (type === 'phone') {
      const clean = val.replace(/\s+/g, '')
      if (clean.length < 8) return '••••••••'
      return clean.slice(0, 5) + '••••' + clean.slice(-2)
    }
    if (type === 'email') {
      const [user, domain] = val.split('@')
      if (!domain) return '••••@••••'
      return user.slice(0, 2) + '••••@' + domain
    }
    if (type === 'address') {
      const parts = val.split(',')
      return parts.length > 1 ? `••••••••, ${parts[parts.length - 1].trim()}` : '•••• Confidential PII'
    }
    return '••••••••'
  }

  return (
    <AdminRoleContext.Provider
      value={{
        role,
        setRole,
        currentStaff,
        canAccessFullPII,
        canProcessRefunds,
        canPublishCMS,
        canBroadcastWhatsApp,
        canManageRBAC,
        transactionCap,
        maskPII,
      }}
    >
      {children}
    </AdminRoleContext.Provider>
  )
}

export function useAdminRole() {
  const context = useContext(AdminRoleContext)
  if (!context) {
    throw new Error('useAdminRole must be used within an AdminRoleProvider')
  }
  return context
}
