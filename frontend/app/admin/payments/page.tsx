'use client'

import React, { useState } from 'react'
import {
  CreditCard,
  IndianRupee,
  Clock,
  RotateCcw,
  Plus,
  FileText,
  Send,
  MoreVertical,
  Activity
} from 'lucide-react'
import { mockPayments } from '../_mock/data'
import { Payment } from '../types'
import { KPICard, Button, Badge, DataTable } from '../../../components/admin/ui'

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')

  const filtered = mockPayments.filter(p => {
     if (statusFilter && p.gateway_status !== statusFilter) return false
     if (methodFilter && p.payment_method !== methodFilter) return false
     return true
  })

  const columns = [
    {
      key: 'id',
      title: 'Transaction ID',
      render: (pay: Payment) => <div style={{ fontWeight: 600, color: '#111827', fontFamily: 'monospace' }}>{pay.id}</div>
    },
    {
      key: 'booking',
      title: 'Booking Ref',
      render: (pay: Payment) => (
         <div>
            <div style={{ fontWeight: 500, color: '#111827', fontFamily: 'monospace' }}>{pay.booking_id}</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>{pay.expedition}</div>
         </div>
      )
    },
    {
      key: 'guest',
      title: 'Guest',
      render: (pay: Payment) => (
         <div>
            <div style={{ fontWeight: 500 }}>{pay.customer_name}</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>{pay.customer_phone}</div>
         </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (pay: Payment) => (
         <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>₹{pay.amount.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>{pay.tranche_info}</div>
         </div>
      )
    },
    {
      key: 'method',
      title: 'Method',
      render: (pay: Payment) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#374151', fontWeight: 500 }}>
            <CreditCard size={14} /> {pay.payment_method}
         </div>
      )
    },
    {
      key: 'date',
      title: 'Date',
      render: (pay: Payment) => <div style={{ color: '#374151' }}>{pay.timestamp}</div>
    },
    {
      key: 'status',
      title: 'Gateway Status',
      render: (pay: Payment) => (
         <Badge variant={pay.gateway_status === 'Captured' ? 'converted' : pay.gateway_status === 'Failed' ? 'failed' : pay.gateway_status === 'Refunded' ? 'default' : 'pending'}>
            {pay.gateway_status}
         </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right' as const,
      render: (pay: Payment) => (
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="icon" icon={<FileText size={14} />} title="View Receipt" />
            <Button variant="icon" icon={<Send size={14} />} title="Resend Link" />
            {pay.gateway_status === 'Captured' && (
               <Button variant="secondary" style={{ padding: '6px', minHeight: 'auto', fontSize: '11px', color: '#EF4444' }} title="Initiate Refund">
                  Refund
               </Button>
            )}
            <Button variant="icon" icon={<MoreVertical size={14} />} title="More" />
         </div>
      )
    }
  ]

  return (
    <>
      {/* Header Actions */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          Razorpay/Stripe integrations, tranche collections, refund processing
        </p>
      </div>

      {/* Metrics Row (4 KPI cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Revenue MTD</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <IndianRupee size={24} color="#10B981" /> 38.4L
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>+14.8% vs last</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Pending Collection</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Clock size={24} color="#F59E0B" /> 6.4L
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>8 active tranches</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Refund Processing</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <RotateCcw size={24} color="#6B7280" /> 0
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>0 cases</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Gateway Health</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Activity size={24} color="#10B981" /> 99.8%
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>🟢 Razorpay Uptime</div>
         </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: '12px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '16px' }}>
         <div style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            All Transactions • Showing {filtered.length} of {mockPayments.length}
         </div>
         
         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
               value={statusFilter} 
               onChange={e => setStatusFilter(e.target.value)}
               style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none' }}
            >
               <option value="">All Gateway Statuses</option>
               <option value="Captured">Captured</option>
               <option value="Pending">Pending</option>
               <option value="Failed">Failed</option>
               <option value="Refunded">Refunded</option>
            </select>
            <select 
               value={methodFilter} 
               onChange={e => setMethodFilter(e.target.value)}
               style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none' }}
            >
               <option value="">All Payment Methods</option>
               <option value="UPI">UPI</option>
               <option value="Netbanking">Netbanking</option>
               <option value="Card">Card</option>
            </select>
            <Button variant="primary" icon={<Plus size={16} />}>Generate Payment Link</Button>
         </div>
      </div>

      {/* Transactions Table */}
      <DataTable 
         columns={columns}
         data={filtered}
         keyExtractor={(pay: any) => pay.id}
      />
    </>
  )
}
