'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'default' | 'wide'
}

export function DetailDrawer({ isOpen, onClose, title, children, size = 'default' }: DetailDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const widthClass = size === 'wide' ? 'md:w-[600px]' : 'md:w-[400px]'

  return (
    <div className="fixed inset-0 z-40 overflow-hidden font-jakarta">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A2540]/40 backdrop-blur-[4px] transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div 
          className={`
            w-full ${widthClass} top-[64px] md:top-0 fixed md:relative h-[calc(100vh-64px)] md:h-screen
            transform transition-transform ease-[cubic-bezier(0.4,0,0.2,1)] duration-300 
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-full flex flex-col bg-surface-white border-l border-surface-border shadow-modal relative">
            {/* Header */}
            <div className="h-16 px-6 py-4 border-b border-surface-border flex items-center justify-between shrink-0">
              <h2 className="text-headline-md tracking-[-0.01em] text-primary">{title}</h2>
              <button 
                onClick={onClose}
                className="text-[#64748B] hover:text-primary p-2 rounded-btn hover:bg-surface transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-64px)] md:max-h-screen">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
