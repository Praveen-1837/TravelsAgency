'use client'

import React, { useState } from 'react'
import {
  User,
  Users,
  Bell,
  Shield,
  CreditCard,
  Save,
  Plus,
  MoreVertical
} from 'lucide-react'
import { mockStaffList } from '../_mock/data'
import { ConciergeStaff } from '../types'
import { Button, Badge, DataTable } from '../../../components/admin/ui'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Staff Roles')

  const tabs = [
    { id: 'General', icon: <User size={16} /> },
    { id: 'Staff Roles', icon: <Users size={16} /> },
    { id: 'Notifications', icon: <Bell size={16} /> },
    { id: 'Security', icon: <Shield size={16} /> },
    { id: 'Billing', icon: <CreditCard size={16} /> },
  ]

  const staffColumns = [
    {
      key: 'name',
      title: 'Staff Member',
      render: (s: ConciergeStaff) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#374151', fontSize: '12px' }}>
               {s.avatar}
            </div>
            <div>
               <div style={{ fontWeight: 600, color: '#111827' }}>{s.name}</div>
               <div style={{ fontSize: '11px', color: '#6B7280' }}>{s.email}</div>
            </div>
         </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      render: (s: ConciergeStaff) => (
         <Badge variant={s.role === 'Super Admin' ? 'quote' : s.role === 'Finance & Escrow' ? 'converted' : 'default'}>
            {s.role}
         </Badge>
      )
    },
    {
      key: 'hub',
      title: 'Regional Hub',
      render: (s: ConciergeStaff) => <div style={{ color: '#374151', fontWeight: 500 }}>{s.regional_hub}</div>
    },
    {
      key: 'status',
      title: 'Status',
      render: (s: ConciergeStaff) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
            <span style={{ color: '#374151', fontSize: '12px' }}>{s.status}</span>
         </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right' as const,
      render: () => (
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button variant="icon" icon={<MoreVertical size={14} />} title="More" />
         </div>
      )
    }
  ]

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          Global dashboard preferences, staff roles, notification routing
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
         {/* Left Sidebar (240px) */}
         <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '12px', 
                     padding: '12px 16px', 
                     borderRadius: '8px', 
                     backgroundColor: activeTab === tab.id ? '#F3F4F6' : 'transparent',
                     color: activeTab === tab.id ? '#111827' : '#4B5563',
                     fontWeight: activeTab === tab.id ? 600 : 500,
                     border: 'none',
                     cursor: 'pointer',
                     textAlign: 'left',
                     transition: 'all 0.2s'
                  }}
               >
                  {React.cloneElement(tab.icon, { color: activeTab === tab.id ? '#111827' : '#6B7280' })}
                  {tab.id}
               </button>
            ))}
         </div>

         {/* Main Content */}
         <div style={{ flex: 1, backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            
            {activeTab === 'General' && (
               <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>General Profile</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                     <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Full Name</label>
                        <input type="text" defaultValue="Praveen Shinde" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }} />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email Address</label>
                        <input type="email" defaultValue="admin@aarivavoyages.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }} />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Hub Location</label>
                        <select style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', backgroundColor: '#FFF' }}>
                           <option>New Delhi (HQ)</option>
                           <option>Mumbai</option>
                           <option>Bangalore</option>
                        </select>
                     </div>
                     <div style={{ marginTop: '8px' }}>
                        <Button variant="primary" icon={<Save size={16} />}>Save Changes</Button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'Staff Roles' && (
               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                     <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>Staff Roles & Permissions</h2>
                     <Button variant="primary" icon={<Plus size={16} />}>Invite Staff</Button>
                  </div>
                  
                  <DataTable 
                     columns={staffColumns}
                     data={mockStaffList}
                     keyExtractor={(s: any) => s.id}
                  />
               </div>
            )}

            {activeTab === 'Notifications' && (
               <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Notification Preferences</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
                     {[
                        { title: 'New Inquiry Alerts', desc: 'Receive notifications when a new high-value inquiry is submitted.' },
                        { title: 'Payment Confirmations', desc: 'Alerts for successful tranche payments and escrow settlements.' },
                        { title: 'Escalation Flags', desc: 'Immediate SMS for critical reviews or operations escalations.' },
                        { title: 'Weekly Reports', desc: 'Automated KPI digest sent every Monday at 9 AM.' }
                     ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i < 3 ? '1px solid #E5E7EB' : 'none' }}>
                           <div>
                              <div style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{item.title}</div>
                              <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>{item.desc}</div>
                           </div>
                           <input type="checkbox" defaultChecked={i !== 3} style={{ width: '18px', height: '18px', accentColor: '#111827', cursor: 'pointer' }} />
                        </div>
                     ))}
                     <div style={{ marginTop: '16px' }}>
                        <Button variant="primary" icon={<Save size={16} />}>Update Preferences</Button>
                     </div>
                  </div>
               </div>
            )}

            {(activeTab === 'Security' || activeTab === 'Billing') && (
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#6B7280' }}>
                  Configuration options for {activeTab} will appear here.
               </div>
            )}
         </div>
      </div>
    </>
  )
}
