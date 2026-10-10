'use client'

import React from 'react'
import {
  MessageCircle,
  CreditCard,
  Layers,
  Activity,
  RefreshCw,
  Settings
} from 'lucide-react'
import { Button } from '../../../components/admin/ui'

export default function IntegrationsPage() {
  const integrations = [
    {
       id: 'whatsapp',
       name: 'WhatsApp Meta Business',
       icon: <MessageCircle size={32} color="#10B981" />,
       status: 'Active',
       description: 'Message routing and 1-click itinerary dispatch.',
    },
    {
       id: 'sanity',
       name: 'Sanity CMS',
       icon: <Layers size={32} color="#8B5CF6" />,
       status: 'Active',
       description: 'Content syncing for homepage and lookbooks.',
    },
    {
       id: 'razorpay',
       name: 'Razorpay',
       icon: <CreditCard size={32} color="#3B82F6" />,
       status: 'Active',
       description: 'Payment gateway and webhook routing.',
    }
  ]

  return (
    <>
      {/* Header Actions */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          WhatsApp Meta API, Sanity CMS, Razorpay webhooks
        </p>
      </div>

      {/* Metrics Row (3 KPI cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>WhatsApp API</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Activity size={24} color="#10B981" /> 99.9%
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>🟢 Uptime</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Razorpay API</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Activity size={24} color="#10B981" /> 100%
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>🟢 Uptime</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Sanity CMS Sync</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <RefreshCw size={24} color="#3B82F6" /> Just now
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Last sync 2m ago</div>
         </div>
      </div>

      {/* Integrations Grid (3 columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
         {integrations.map(integ => (
            <div key={integ.id} style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {integ.icon}
               </div>
               <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{integ.name}</h3>
                  <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                     <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span> {integ.status}
                  </div>
               </div>
               <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.5' }}>
                  {integ.description}
               </p>
               <div style={{ marginTop: 'auto', paddingTop: '8px', width: '100%' }}>
                  <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }} icon={<Settings size={14} />}>Configure</Button>
               </div>
            </div>
         ))}
      </div>
    </>
  )
}
