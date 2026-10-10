import React from 'react'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  actionButtons?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function PageHeader({ title, actionButtons, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-surface-border font-jakarta bg-transparent">
      <div className="flex flex-col gap-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-body-sm text-[#64748B] mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#94A3B8]">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && (
                  <span className="text-[#CBD5E1]">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-headline-lg text-primary tracking-[-0.015em] leading-tight w-full">{title}</h1>
      </div>
      
      {actionButtons && (
        <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
          {actionButtons}
        </div>
      )}
    </div>
  )
}
