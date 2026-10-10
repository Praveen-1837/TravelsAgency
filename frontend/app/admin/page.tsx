'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  PhoneCall,
  Compass,
  IndianRupee,
  Clock,
} from 'lucide-react'
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Area,
  AreaChart,
  BarChart,
  Bar
} from 'recharts'
import {
  mockRevenueTrends,
  mockTopPackages,
  mockInquiries,
  mockBookings,
  mockPayments,
} from './_mock/data'
import { KPICard, AlertCard, Button, Badge } from '../../components/admin/ui'

export default function OverviewPage() {
  const [claimedInquiryId, setClaimedInquiryId] = useState<string | null>(null)
  const [retrySentBooking, setRetrySentBooking] = useState<string | null>(null)
  const [voucherGeneratedBooking, setVoucherGeneratedBooking] = useState<string | null>(null)

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`

  const handleClaim = (inqId: string) => {
    setClaimedInquiryId(inqId)
  }

  const handleRetryPayment = (bookingId: string) => {
    setRetrySentBooking(bookingId)
  }

  const handleGenerateVoucher = (bookingId: string) => {
    setVoucherGeneratedBooking(bookingId)
  }

  return (
    <>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          Real-time operations monitoring
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" icon={<PhoneCall size={16} />} onClick={() => window.location.href='/admin/inquiries'}>
            Open Callbacks (19)
          </Button>
          <Button variant="secondary" icon={<Compass size={16} />} onClick={() => window.location.href='/admin/bookings'}>
            Expedition Manifest
          </Button>
        </div>
      </div>

      {/* KPI Cards Row (4 columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <KPICard 
          label="Open Callbacks"
          metric="19 urgent"
          icon={<PhoneCall size={24} />}
          iconColor="orange"
          changeIndicator={{ value: '+2.4% vs target', isPositive: true }}
          secondaryInfo="Target: 160"
        />
        <KPICard 
          label="Revenue MTD"
          metric="₹38.4L"
          icon={<IndianRupee size={24} />}
          iconColor="green"
          changeIndicator={{ value: '+14.8% vs last month', isPositive: true }}
          secondaryInfo="₹33.4L previous"
        />
        <KPICard 
          label="Bookings MTD"
          metric="64/80"
          icon={<Compass size={24} />}
          iconColor="blue"
          secondaryInfo="80.0% of pace"
        />
        <KPICard 
          label="Pending Balance"
          metric="₹6.4L"
          icon={<Clock size={24} />}
          iconColor="default"
          secondaryInfo="8 tranches, 3 due <48h"
        />
      </div>

      {/* Urgent Action Items Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--admin-color-text-primary)' }}>
          Urgent Action Items
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          <AlertCard type="error" title="SLA Breach (>24h)" action={
            <Button variant="primary" style={{ padding: '8px 12px', minHeight: 'auto', fontSize: '12px' }} onClick={() => handleClaim('INQ-1')}>
              {claimedInquiryId === 'INQ-1' ? 'CLAIMED ✓' : 'CLAIM & CALL'}
            </Button>
          }>
            <div style={{ color: 'var(--admin-color-text-primary)', fontWeight: 500 }}>Sunita Verma</div>
            <div style={{ fontSize: '12px' }}>Kashmir... 28h ago</div>
          </AlertCard>

          <AlertCard type="warning" title="Failed Payment" action={
            <Button variant="secondary" style={{ padding: '8px 12px', minHeight: 'auto', fontSize: '12px' }} onClick={() => handleRetryPayment('BK-1')}>
              {retrySentBooking === 'BK-1' ? 'SENT ✓' : 'SEND RETRY'}
            </Button>
          }>
            <div style={{ color: 'var(--admin-color-text-primary)', fontWeight: 500 }}>Sanjay Singhania</div>
            <div style={{ fontSize: '12px' }}>₹92,500 timeout</div>
          </AlertCard>

          <AlertCard type="warning" title="Missing Voucher" action={
             <Button variant="secondary" style={{ padding: '8px 12px', minHeight: 'auto', fontSize: '12px' }} onClick={() => handleGenerateVoucher('BK-2')}>
              {voucherGeneratedBooking === 'BK-2' ? 'READY ✓' : 'GENERATE'}
            </Button>
          }>
             <div style={{ color: 'var(--admin-color-text-primary)', fontWeight: 500 }}>Anand Mahindra</div>
             <div style={{ fontSize: '12px', color: 'var(--admin-color-error)' }}>Departs 36h</div>
          </AlertCard>

          <AlertCard type="warning" title="Ground Alert" action={
             <Button variant="secondary" style={{ padding: '8px 12px', minHeight: 'auto', fontSize: '12px' }} onClick={() => window.location.href='/admin/bookings'}>
               VIEW
             </Button>
          }>
             <div style={{ color: 'var(--admin-color-text-primary)', fontWeight: 500 }}>Gulmarg VIP Setup</div>
             <div style={{ fontSize: '12px' }}>Verma Family</div>
          </AlertCard>

        </div>
      </section>

      {/* Charts Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>Revenue Trend</h2>
            <div style={{ height: '300px', width: '100%', margin: '0 -10px' }}>
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueTrends} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
                  <RechartsTooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="actual" stroke="#FF8C00" strokeWidth={3} fill="#FFE8CC" fillOpacity={0.5} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#3B82F6" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>Top 5 Packages</h2>
            <div style={{ height: '300px', width: '100%', margin: '0 -20px' }}>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={mockTopPackages} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                   <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
                   <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} width={100} />
                   <RechartsTooltip cursor={{fill: '#F3F4F6'}} formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']} />
                   <Bar dataKey="revenue" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </section>

      {/* Live Streams Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxHeight: '400px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
               Recent Inquiries
               <Link href="/admin/inquiries" style={{ fontSize: '12px', color: '#FF8C00', fontWeight: 500, textDecoration: 'none' }}>View all</Link>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {mockInquiries.slice(0,5).map(inq => (
                  <div key={inq.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                     <div>
                        <div style={{ fontWeight: 500, color: '#374151', fontSize: '14px' }}>{inq.customer_name}</div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>{inq.package_name}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <Badge variant={inq.status === 'New' ? 'new' : inq.status === 'Quote Sent' ? 'quote' : 'default'}>{inq.status}</Badge>
                        <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{inq.time_received_str}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxHeight: '400px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
               Recent Bookings
               <Link href="/admin/bookings" style={{ fontSize: '12px', color: '#FF8C00', fontWeight: 500, textDecoration: 'none' }}>Manifest</Link>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {mockBookings.slice(0,5).map(bkg => (
                  <div key={bkg.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                     <div>
                        <div style={{ fontWeight: 500, color: '#374151', fontSize: '14px' }}>{bkg.customer_name}</div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>{bkg.package_name}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>₹{(bkg.total_amount/100000).toFixed(1)}L</div>
                        <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{bkg.departure_date}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxHeight: '400px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
               Revenue Pulse
               <Link href="/admin/payments" style={{ fontSize: '12px', color: '#FF8C00', fontWeight: 500, textDecoration: 'none' }}>Settlements</Link>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {mockPayments.slice(0,5).map(pay => (
                  <div key={pay.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                     <div>
                        <div style={{ fontWeight: 500, color: '#374151', fontSize: '14px' }}>₹{(pay.amount).toLocaleString()}</div>
                        <div style={{ color: '#6B7280', fontSize: '12px' }}>{pay.customer_name}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <Badge variant={pay.gateway_status === 'Captured' ? 'converted' : pay.gateway_status === 'Failed' ? 'failed' : 'pending'}>{pay.gateway_status}</Badge>
                        <div style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{pay.payment_method}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </>
  )
}
