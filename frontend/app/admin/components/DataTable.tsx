'use client'

import React from 'react'

export interface Column<T> {
  key: string
  title: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  keyExtractor: (item: T) => string
}

export function DataTable<T>({ columns, data, onRowClick, keyExtractor }: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-white rounded-card border border-surface-border py-[100px] text-center font-jakarta">
        <div className="text-[#64748B] mb-2 text-body-md">No data available</div>
      </div>
    )
  }

  return (
    <div className="bg-surface-white rounded-card border border-surface-border overflow-x-auto font-jakarta">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead className="sticky top-0 bg-[#F8FAFC] z-10">
          <tr className="h-10 border-b border-surface-border">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.02em]">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-surface-white">
          {data.map((item) => (
            <tr 
              key={keyExtractor(item)} 
              onClick={() => onRowClick && onRowClick(item)}
              className={`h-[52px] border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC] transition-colors duration-100 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-body-md text-primary font-medium">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
