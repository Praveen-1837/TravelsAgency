'use client'

import React, { useState } from 'react'
import {
  Compass,
  Calendar,
  List,
  Clock,
  Car,
  Send,
  Plus,
  Download,
  MoreVertical,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { mockBookings, mockDepartureRadar } from '../_mock/data'
import { Booking } from '../types'
import { KPICard, Button, Badge, DataTable, AlertCard } from '../../../components/admin/ui'

export default function BookingsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'radar'>('table')

  const voucherQueue = [
    { id: '#AV-2024-118', guest: 'Sanjay Singhania', expedition: 'Kashmir Autumn Magic', departure: '07 Oct 2026', status: 'Ready to Dispatch' },
    { id: '#AV-2024-112', guest: 'Anand Mahindra Charter', expedition: 'Leh Ladakh Luxury', departure: '07 Oct 2026', status: 'Awaiting Sign-off' },
    { id: '#AV-2024-114', guest: 'Radhika Goenka', expedition: 'Kerala Backwaters', departure: '07 Oct 2026', status: 'Drafting Manifest' },
    { id: '#AV-2024-115', guest: 'Sunita Verma', expedition: 'Rajasthan Royal Desert', departure: '10 Oct 2026', status: 'Dispatched to Guest' },
  ]

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`

  const columns = [
    {
      key: 'id',
      title: 'Booking ID',
      render: (bkg: Booking) => <div style={{ fontWeight: 600, color: '#111827', fontFamily: 'monospace' }}>{bkg.id}</div>
    },
    {
      key: 'guest',
      title: 'Guest',
      render: (bkg: Booking) => (
         <div>
            <div style={{ fontWeight: 500, color: '#111827' }}>{bkg.customer_name}</div>
            <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>{bkg.customer_phone}</div>
         </div>
      )
    },
    {
      key: 'package',
      title: 'Package',
      render: (bkg: Booking) => (
         <div>
            <div style={{ fontWeight: 500 }}>{bkg.package_name}</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>{bkg.package_duration}</div>
         </div>
      )
    },
    {
      key: 'dates',
      title: 'Dates',
      render: (bkg: Booking) => (
         <div>
            <div style={{ color: '#374151', fontWeight: 500 }}>{bkg.departure_date}</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>to {bkg.return_date}</div>
         </div>
      )
    },
    {
      key: 'chauffeur',
      title: 'Chauffeur',
      render: (bkg: Booking) => (
         bkg.chauffeur.assigned ? (
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <Car size={14} color="#374151" /> {bkg.chauffeur.name}
               </div>
               <div style={{ fontSize: '11px', color: '#6B7280' }}>{bkg.chauffeur.vehicle}</div>
            </div>
         ) : (
            <Badge variant="pending">Unassigned</Badge>
         )
      )
    },
    {
      key: 'party',
      title: 'Party Size',
      render: (bkg: Booking) => <div style={{ color: '#374151' }}>{bkg.party_size}</div>
    },
    {
      key: 'financials',
      title: 'Financials',
      render: (bkg: Booking) => (
         <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>₹{bkg.total_amount.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: bkg.total_amount - bkg.paid_amount > 0 ? '#EF4444' : '#10B981', fontWeight: 500 }}>
               Bal: ₹{(bkg.total_amount - bkg.paid_amount).toLocaleString()}
            </div>
         </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (bkg: Booking) => (
         <Badge variant={bkg.status === 'Confirmed' ? 'converted' : 'default'}>{bkg.status}</Badge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right' as const,
      render: (bkg: Booking) => (
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="secondary" style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '11px' }}>Review</Button>
            <Button variant="icon" icon={<Send size={14} />} title="Send Voucher" />
            <Button variant="icon" icon={<MoreVertical size={14} />} title="Options" />
         </div>
      )
    }
  ]

  return (
    <>
      {/* Header Actions */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          Live guest manifest, chauffeur handovers, 7-day departure radar, instant voucher dispatches
        </p>
      </div>

      {/* Metrics Row (5 KPI cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Confirmed Bookings</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>64/80</div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
               <div style={{ width: '80%', height: '100%', backgroundColor: '#3B82F6' }}></div>
            </div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Total Booked Value</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>₹43.2L</div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>+14% vs last</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Avg Booking Ticket</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>₹67.5K</div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Luxury Charter</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Pending Balances</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', margin: '4px 0' }}>₹6.4L</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>3 due &lt;48h</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Upcoming Departures</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>1 in 48h</div>
            <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 500 }}>🔴 Alert Active</div>
         </div>
      </div>

      {/* Voucher Dispatch Queue (Horizontal scroll) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
         <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#EF4444" /> Urgent Voucher Dispatch Queue
         </h2>
         <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px' }}>
            {voucherQueue.map(vq => (
               <div key={vq.id} style={{ 
                  minWidth: '280px', 
                  backgroundColor: '#FFF', 
                  border: '1px solid #E5E7EB', 
                  borderLeft: '4px solid #EF4444',
                  borderRadius: '8px', 
                  padding: '16px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
               }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontWeight: 600, color: '#111827' }}>{vq.guest}</div>
                     <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>{vq.departure}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{vq.expedition}</div>
                  <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 500 }}>⚠️ {vq.status}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                     <Button variant="secondary" style={{ flex: 1, padding: '6px', minHeight: '32px', fontSize: '11px' }} icon={<FileText size={12}/>}>PDF</Button>
                     <Button variant="primary" style={{ flex: 1, padding: '6px', minHeight: '32px', fontSize: '11px', backgroundColor: '#10B981' }} icon={<Send size={12}/>}>WhatsApp</Button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* View Options & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: '12px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '16px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>View as:</span>
            <div style={{ display: 'flex', backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
               <button onClick={() => setViewMode('table')} style={{ padding: '8px 12px', backgroundColor: viewMode==='table' ? '#F3F4F6' : '#FFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: viewMode==='table' ? '#111827' : '#6B7280' }}>
                  <List size={14} /> Table
               </button>
               <div style={{ width: '1px', backgroundColor: '#E5E7EB' }}></div>
               <button onClick={() => setViewMode('radar')} style={{ padding: '8px 12px', backgroundColor: viewMode==='radar' ? '#F3F4F6' : '#FFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: viewMode==='radar' ? '#111827' : '#6B7280' }}>
                  <Calendar size={14} /> Departure Radar
               </button>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primary" icon={<Plus size={16} />}>Create Manual Booking</Button>
            <Button variant="secondary" icon={<Download size={16} />}>Export Manifest</Button>
         </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'table' ? (
         <DataTable 
            columns={columns}
            data={mockBookings}
            keyExtractor={(bkg: any) => bkg.id}
         />
      ) : (
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>7-Day Departure Radar</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
               {mockDepartureRadar.map((col) => (
                  <div key={col.date} style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '12px', backgroundColor: col.count > 0 ? '#F9FAFB' : '#FFF' }}>
                     <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>{col.date}</div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>{col.day}</div>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '100px' }}>
                        {col.departures.length === 0 ? (
                           <div style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>No departures</div>
                        ) : (
                           col.departures.map(dep => (
                              <div key={dep.id} style={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#111827', fontWeight: 600, fontFamily: 'monospace' }}>{dep.id}</div>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dep.voucherReady ? '#10B981' : '#F59E0B' }}></span>
                                 </div>
                                 <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dep.guest}</div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

    </>
  )
}
