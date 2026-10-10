import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  status: 'blue' | 'amber' | 'green' | 'teal' | 'red' | 'gray'
  trend?: string
}

export function StatCard({ title, value, icon, status, trend }: StatCardProps) {
  const getIconColor = () => {
    switch (status) {
      case 'blue': return 'text-[#0284C7] bg-[#E0F2FE]'
      case 'amber': return 'text-[#B45309] bg-[#FEF3C7]'
      case 'green': return 'text-[#15803D] bg-[#DCFCE7]'
      case 'teal': return 'text-[#0F766E] bg-[#CCFBF1]'
      case 'red': return 'text-[#B91C1C] bg-[#FEE2E2]'
      case 'gray': return 'text-[#475569] bg-[#F1F5F9]'
      default: return 'text-primary bg-surface'
    }
  }

  return (
    <div className="bg-surface-white rounded-card border border-surface-border p-6 min-h-[140px] flex flex-col font-jakarta transition-all duration-150 hover:border-secondary hover:shadow-card-hover group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[#64748B] text-body-md font-normal">{title}</h3>
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getIconColor()}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col mt-auto">
        <div className="flex items-baseline">
          <span className="text-headline-lg text-primary tracking-[-0.015em]">{value}</span>
        </div>
        {trend && (
          <span className="text-body-sm font-normal text-[#64748B] mt-1">{trend}</span>
        )}
      </div>
    </div>
  )
}
