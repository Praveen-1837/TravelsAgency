'use client'

import React, { useState } from 'react'
import {
  PhoneCall,
  MessageCircle,
  FileText,
  UserPlus,
  Download,
  Users,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react'
import { mockInquiries, mockFunnelData } from '../_mock/data'
import { KPICard, Button, Badge, DataTable } from '../../../components/admin/ui'
import { Inquiry } from '../types'

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<string>('All')

  // Filter tabs
  const tabs = ['All', 'New', 'Contacted', 'Quote Sent', 'Converted', 'Lost']
  
  const filtered = mockInquiries.filter(inq => {
    if (activeTab !== 'All' && inq.status !== activeTab) return false
    return true
  })

  // Table Columns
  const columns = [
    {
      key: 'time',
      title: 'Time',
      render: (item: Inquiry) => (
        <div>
          <div style={{ fontWeight: 500, color: '#111827' }}>{item.time_received_str}</div>
          {item.is_overdue && <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>&gt;24h Overdue</div>}
        </div>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (item: Inquiry) => (
        <div style={{ fontWeight: 600, color: '#111827' }}>{item.customer_name}</div>
      )
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (item: Inquiry) => (
        <div style={{ color: '#374151', fontFamily: 'monospace' }}>{item.phone}</div>
      )
    },
    {
      key: 'origin',
      title: 'Origin',
      render: (item: Inquiry) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
           {item.origin_channel === 'WhatsApp' ? <MessageCircle size={14} color="#10B981" /> : <FileText size={14} color="#3B82F6" />}
           <span>{item.origin_channel}</span>
        </div>
      )
    },
    {
      key: 'package',
      title: 'Package',
      render: (item: Inquiry) => (
        <div style={{ fontWeight: 500 }}>{item.package_name}</div>
      )
    },
    {
      key: 'dates',
      title: 'Dates',
      render: (item: Inquiry) => (
         <div>{item.requested_dates}</div>
      )
    },
    {
      key: 'budget',
      title: 'Budget',
      render: (item: Inquiry) => (
        <div style={{ fontWeight: 600, color: '#111827' }}>{item.budget_range}</div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: Inquiry) => (
        <Badge variant={item.status === 'New' ? 'new' : item.status === 'Quote Sent' ? 'quote' : item.status === 'Contacted' ? 'contacted' : item.status === 'Converted' ? 'converted' : 'default'}>
           {item.status}
        </Badge>
      )
    },
    {
      key: 'concierge',
      title: 'Concierge',
      render: (item: Inquiry) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.assigned_concierge.name === 'Unassigned' ? '#EF4444' : '#10B981' }}></span>
            <span style={{ color: item.assigned_concierge.name === 'Unassigned' ? '#EF4444' : '#374151', fontWeight: item.assigned_concierge.name === 'Unassigned' ? 600 : 400 }}>
               {item.assigned_concierge.name}
            </span>
         </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right' as const,
      render: (item: Inquiry) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
           <Button variant="icon" icon={<PhoneCall size={16} />} title="Call" />
           <Button variant="icon" icon={<MessageCircle size={16} />} title="WhatsApp" />
           <Button variant="icon" icon={<CheckCircle2 size={16} />} title="Mark Contacted" />
           <Button variant="icon" icon={<MoreVertical size={16} />} title="More options" />
        </div>
      )
    }
  ]

  return (
    <>
      {/* Header Actions */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          High-intent inquiry intake, round-robin concierge distribution, SLA monitoring
        </p>
      </div>

      {/* Metrics Row (6 KPI cards, small) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Total Inquiries (Month)</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>142</div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>+18.4% vs last</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Monthly Target</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>160</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>89% quota</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>New Leads</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>12</div>
            <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500 }}>🔴 Action Required</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>SLA Avg Response</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>42 mins</div>
            <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500 }}>Target: &lt;30m</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Last Synced</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>14s ago</div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>🟢 Live</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Conversion Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>26.1%</div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Above benchmark</div>
         </div>
      </div>

      {/* Conversion Funnel (Visual) */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
         <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Conversion Funnel (Month-to-Date)</h2>
         <div style={{ display: 'flex', alignItems: 'center', height: '80px', gap: '16px' }}>
            {mockFunnelData.map((stage, idx) => (
               <React.Fragment key={stage.step}>
                  <div style={{ flex: 1, backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>{stage.step}</div>
                     <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{stage.count}</span>
                        <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>{stage.percentage}</span>
                     </div>
                  </div>
                  {idx < mockFunnelData.length - 1 && (
                     <div style={{ color: '#9CA3AF' }}>→</div>
                  )}
               </React.Fragment>
            ))}
         </div>
      </div>

      {/* Bulk Actions & Filter Bar */}
      <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
         <div style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            {activeTab} Inquiries • Showing {filtered.length} of {mockInquiries.length}
         </div>
         
         <div style={{ display: 'flex', gap: '8px' }}>
            {tabs.map(tab => (
               <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                     padding: '6px 12px',
                     borderRadius: '6px',
                     fontSize: '13px',
                     fontWeight: 500,
                     border: '1px solid',
                     borderColor: activeTab === tab ? '#FF8C00' : 'transparent',
                     backgroundColor: activeTab === tab ? '#FFF3E0' : 'transparent',
                     color: activeTab === tab ? '#FF8C00' : '#6B7280',
                     cursor: 'pointer',
                     transition: 'all 0.2s'
                  }}
               >
                  {tab}
               </button>
            ))}
         </div>

         <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" icon={<UserPlus size={16} />}>Log Manual Lead</Button>
            <Button variant="secondary" icon={<Users size={16} />}>Assign Staff</Button>
            <Button variant="secondary" icon={<Download size={16} />}>Export CSV</Button>
         </div>
      </div>

      {/* Inquiry Table */}
      <DataTable 
         columns={columns}
         data={filtered}
         keyExtractor={(item: any) => item.id}
      />
    </>
  )
}
