'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: React.ReactNode
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDangerous = false 
}: ConfirmModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => setShow(true), 10)
    } else {
      setShow(false)
      setTimeout(() => {
        document.body.style.overflow = 'unset'
      }, 200)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen && !show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-jakarta">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#0A2540]/40 backdrop-blur-[4px] transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div 
        className={`
          relative bg-surface-white border border-surface-border rounded-card p-8 shadow-modal
          w-[90vw] md:w-[400px] md:min-w-[400px] max-w-lg
          transition-all duration-200
          ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#64748B] hover:text-primary p-2 rounded-btn hover:bg-surface transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-headline-md text-primary mb-4 pr-6 tracking-[-0.01em]">{title}</h2>
        <div className="text-body-md text-[#64748B] mb-6 leading-[1.43]">
          {message}
        </div>

        <div className="flex flex-row justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-btn bg-surface-white border border-surface-border text-primary font-medium hover:bg-surface hover:border-secondary transition-colors min-w-[44px] min-h-[44px]"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 rounded-btn text-white font-medium transition-colors min-w-[44px] min-h-[44px]
              ${isDangerous 
                ? 'bg-[#B91C1C] hover:bg-[#991B1B] focus:ring-[3px] focus:ring-[#B91C1C]/10' 
                : 'bg-[#0A2540] hover:bg-[#071a2e] focus:ring-[3px] focus:ring-[#0A2540]/10'
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
