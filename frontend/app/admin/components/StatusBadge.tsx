import React from 'react'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getColors = (status: string) => {
    const s = status.toLowerCase()
    switch (s) {
      case 'new':
      case 'ingested':
        return 'bg-[#E0F2FE] text-[#0369A1]'
      case 'pending':
      case 'contacted':
      case 'quote sent':
      case 'in progress':
        return 'bg-[#FEF3C7] text-[#B45309]'
      case 'confirmed':
      case 'completed':
      case 'converted':
      case 'paid':
      case 'approved':
        return 'bg-[#DCFCE7] text-[#15803D]'
      case 'cancelled':
      case 'failed':
        return 'bg-[#FEE2E2] text-[#B91C1C]'
      case 'refunded':
      case 'lost':
      case 'archived':
      case 'rejected':
      default:
        return 'bg-[#F1F5F9] text-[#475569]'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-medium font-jakarta leading-[1.38] ${getColors(status)} ${className}`}>
      {status}
    </span>
  )
}
