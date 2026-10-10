'use client'

import React, { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { DataTable } from '../components/DataTable'
import { mockAnalytics } from '../_mock/data'
import { Download, Calendar as CalendarIcon } from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('This Month')

  // Data mapping for charts
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 450000 }, { name: 'Feb', revenue: 520000 },
    { name: 'Mar', revenue: 680000 }, { name: 'Apr', revenue: 750000 },
    { name: 'May', revenue: 1100000 }, { name: 'Jun', revenue: 950000 },
    { name: 'Jul', revenue: 850000 }, { name: 'Aug', revenue: 900000 },
    { name: 'Sep', revenue: 1250000 }, { name: 'Oct', revenue: 1400000 },
    { name: 'Nov', revenue: 1800000 }, { name: 'Dec', revenue: 2100000 },
  ]

  const travellerTypeData = [
    { name: 'Honeymoon', value: 65 },
    { name: 'Group/Family', value: 35 },
  ]

  const stateData = [
    { id: 1, state: 'Maharashtra', inquiries: 450, bookings: 120, revenue: 5400000, conversion: '26.6%' },
    { id: 2, state: 'Karnataka', inquiries: 380, bookings: 95, revenue: 4275000, conversion: '25.0%' },
    { id: 3, state: 'Delhi', inquiries: 320, bookings: 80, revenue: 3600000, conversion: '25.0%' },
    { id: 4, state: 'Gujarat', inquiries: 250, bookings: 60, revenue: 2700000, conversion: '24.0%' },
    { id: 5, state: 'Tamil Nadu', inquiries: 180, bookings: 45, revenue: 2025000, conversion: '25.0%' },
  ]

  const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`

  const stateColumns = [
    { key: 'state', title: 'State/City', render: (item: any) => <span className="font-medium text-secondary cursor-pointer hover:underline">{item.state}</span> },
    { key: 'inquiries', title: 'Inquiries', render: (item: any) => <span className="font-variant-numeric tabular-nums">{item.inquiries}</span> },
    { key: 'bookings', title: 'Bookings', render: (item: any) => <span className="font-variant-numeric tabular-nums">{item.bookings}</span> },
    { key: 'revenue', title: 'Revenue', render: (item: any) => <span className="font-variant-numeric tabular-nums font-medium text-primary">₹{item.revenue.toLocaleString('en-IN')}</span> },
    { key: 'conversion', title: 'Conversion Rate', render: (item: any) => <span className="text-[#10B981] font-medium font-variant-numeric tabular-nums">{item.conversion}</span> },
  ]

  return (
    <div className="font-jakarta">
      <PageHeader 
        title="Analytics & Executive Reporting" 
        actionButtons={
          <div className="flex gap-3 items-center">
            <div className="relative">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-surface-white border border-surface-border text-primary pl-10 pr-8 py-2 rounded-btn text-body-md font-medium hover:bg-surface transition-colors focus:outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/10 min-h-[44px]"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>Last Year</option>
                <option>Custom Range...</option>
              </select>
              <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            </div>
            
            <button className="bg-primary text-white px-4 py-2 rounded-btn text-body-md font-medium hover:bg-[#071a2e] transition-colors flex items-center gap-2 focus:ring-[3px] focus:ring-primary/10 min-h-[44px]">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        }
      />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-element-gap mb-element-gap">
        
        {/* Inquiry Funnel */}
        <div className="bg-surface-white p-card-p rounded-card border border-surface-border transition-shadow hover:shadow-card-hover">
          <h3 className="text-headline-md text-primary mb-6">Inquiry Conversion Funnel</h3>
          <div className="space-y-4">
            {[
              { label: 'Total Inquiries', value: mockAnalytics.inquiryFunnel.total, color: 'bg-status-new-bg', fill: 'bg-primary' },
              { label: 'Contacted', value: mockAnalytics.inquiryFunnel.contacted, color: 'bg-status-pending-bg', fill: 'bg-secondary' },
              { label: 'Quote Sent', value: mockAnalytics.inquiryFunnel.quoteSent, color: 'bg-status-pending-bg', fill: 'bg-emerald-600' },
              { label: 'Converted', value: mockAnalytics.inquiryFunnel.converted, color: 'bg-status-confirmed-bg', fill: 'bg-[#15803D]' }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-body-sm font-medium text-tertiary">{step.label}</span>
                  <span className="text-body-sm font-bold text-primary font-variant-numeric tabular-nums">{step.value}</span>
                </div>
                <div className={`w-full h-8 rounded-btn ${step.color} overflow-hidden`}>
                  <div 
                    className={`h-full ${step.fill} transition-all duration-1000`} 
                    style={{ width: `${(step.value / mockAnalytics.inquiryFunnel.total) * 100}%` }}
                  ></div>
                </div>
                {idx > 0 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 text-body-sm font-semibold text-tertiary font-variant-numeric tabular-nums">
                    {Math.round((step.value / mockAnalytics.inquiryFunnel.total) * 100)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue By Package */}
        <div className="bg-surface-white p-card-p rounded-card border border-surface-border transition-shadow hover:shadow-card-hover">
          <h3 className="text-headline-md text-primary mb-6">Revenue by Package (Top 5)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.revenueByPackage} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tickFormatter={(val) => `₹${val/100000}L`} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis dataKey="packageName" type="category" width={100} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip formatter={(value: any) => [`₹${(value as number).toLocaleString('en-IN')}`, 'Revenue']} cursor={{fill: 'rgba(2, 132, 199, 0.05)'}} />
                <Bar dataKey="revenue" fill="#0A2540" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Over Time */}
      <div className="bg-surface-white p-card-p rounded-card border border-surface-border transition-shadow hover:shadow-card-hover mb-element-gap">
        <h3 className="text-headline-md text-primary mb-6">Revenue by Month (Last 12 Months)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip formatter={(value: any) => [`₹${(value as number).toLocaleString('en-IN')}`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#0284C7" strokeWidth={3} dot={{ r: 4, fill: '#0284C7', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#38BDF8', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-element-gap mb-element-gap">
        {/* Traveller Type */}
        <div className="bg-surface-white p-card-p rounded-card border border-surface-border transition-shadow hover:shadow-card-hover">
          <h3 className="text-headline-md text-primary mb-2">Revenue by Traveller Type</h3>
          <div className="h-[250px] w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={travellerTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#38BDF8" />
                  <Cell fill="#0284C7" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sources */}
        <div className="bg-surface-white p-card-p rounded-card border border-surface-border transition-shadow hover:shadow-card-hover">
          <h3 className="text-headline-md text-primary mb-2">Top Inquiry Sources</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.topSources} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="source" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip cursor={{fill: 'rgba(2, 132, 199, 0.05)'}} />
                <Bar dataKey="count" fill="#0A2540" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* States Table */}
      <div className="mb-8">
        <h3 className="text-headline-md text-primary mb-4">Top Regions (States / Cities)</h3>
        <DataTable 
          columns={stateColumns}
          data={stateData}
          keyExtractor={(item) => item.id.toString()}
        />
      </div>
    </div>
  )
}
