'use client'

import React, { useState } from 'react'
import {
  Users,
  Award,
  Crown,
  History,
  Download,
  MessageCircle,
  FileText,
  MessageSquarePlus,
  MapPin
} from 'lucide-react'
import { mockCustomers } from '../_mock/data'
import { Customer } from '../types'
import { KPICard, Button, Badge, DataTable } from '../../../components/admin/ui'

export default function CustomersPage() {
  const [tierFilter, setTierFilter] = useState('')

  const filtered = mockCustomers.filter(c => {
     if (tierFilter && c.tier !== tierFilter) return false
     return true
  })

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`

  const columns = [
    {
      key: 'customer',
      title: 'Customer',
      render: (c: Customer) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#374151', fontSize: '12px' }}>
               {c.initials}
            </div>
            <div>
               <div style={{ fontWeight: 600, color: '#111827' }}>{c.name}</div>
               <div style={{ fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={10} /> {c.location}
               </div>
            </div>
         </div>
      )
    },
    {
      key: 'tier',
      title: 'Loyalty Tier',
      render: (c: Customer) => (
         <Badge variant={c.tier === 'Elite Sovereign' ? 'quote' : 'new'}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               {c.tier === 'Elite Sovereign' && <Crown size={12} />}
               {c.tier_badge}
            </span>
         </Badge>
      )
    },
    {
      key: 'ltv',
      title: 'Lifetime Value',
      render: (c: Customer) => (
         <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>{formatCurrency(c.lifetime_spend)}</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>{c.expedition_count} Expeditions</div>
         </div>
      )
    },
    {
      key: 'last_trip',
      title: 'Last Trip',
      render: (c: Customer) => (
         <div>
            <div style={{ color: '#374151', fontWeight: 500 }}>{c.last_activity}</div>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 500 }}>NPS: {c.nps_score}</div>
         </div>
      )
    },
    {
      key: 'preferences',
      title: 'Preferences',
      render: (c: Customer) => (
         <div style={{ fontSize: '12px', color: '#6B7280', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {c.bespoke_preferences.dietary} • {c.bespoke_preferences.accommodations}
         </div>
      )
    },
    {
      key: 'concierge',
      title: 'Assigned Concierge',
      render: (c: Customer) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
            <span style={{ color: '#374151' }}>{c.relationship_manager.name}</span>
         </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right' as const,
      render: (c: Customer) => (
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="secondary" style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '11px' }} icon={<FileText size={12} />}>Dossier</Button>
            <Button variant="icon" icon={<MessageCircle size={14} color="#10B981" />} title="WhatsApp" />
            <Button variant="icon" icon={<MessageSquarePlus size={14} />} title="Add Note" />
         </div>
      )
    }
  ]

  return (
    <>
      {/* Header Actions */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          High-net-worth client database, loyalty tiers, lifetime value (LTV)
        </p>
      </div>

      {/* Metrics Row (4 KPI cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Total HNW Clients</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Users size={24} color="#3B82F6" /> 1,420
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>+12 this month</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Elite Tier Members</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Crown size={24} color="#F59E0B" /> 84
            </div>
            <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 500 }}>Spend &gt; ₹20L</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Avg Lifetime Value</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Award size={24} color="#10B981" /> ₹4.2L
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Across all tiers</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Repeat Booking Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <History size={24} color="#3B82F6" /> 18%
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>High loyalty index</div>
         </div>
      </div>

      {/* View Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: '12px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '16px' }}>
         <div style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            All Customers • Showing {filtered.length} of {mockCustomers.length}
         </div>
         
         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
               value={tierFilter} 
               onChange={e => setTierFilter(e.target.value)}
               style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none' }}
            >
               <option value="">All Loyalty Tiers</option>
               <option value="Elite Sovereign">Elite Sovereign</option>
               <option value="VIP Club">VIP Club</option>
               <option value="First-Time">First-Time</option>
            </select>
            <Button variant="secondary" icon={<Download size={16} />}>Export CRM</Button>
         </div>
      </div>

      {/* Customers Table */}
      <DataTable 
         columns={columns}
         data={filtered}
         keyExtractor={(c: any) => c.id}
      />
    </>
  )
}
