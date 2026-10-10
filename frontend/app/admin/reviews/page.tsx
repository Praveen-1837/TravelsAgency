'use client'

import React from 'react'
import {
  Star,
  MessageSquare,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react'
import { mockReviews } from '../_mock/data'
import { Button, Badge } from '../../../components/admin/ui'

export default function ReviewsPage() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#F59E0B' : '#E5E7EB'}
        color={i < rating ? '#F59E0B' : '#E5E7EB'}
      />
    ))
  }

  return (
    <>
      {/* Header Actions */}
      <div style={{ marginBottom: '8px' }}>
        <p style={{ color: 'var(--admin-color-text-secondary)', fontSize: 'var(--admin-font-size-body)' }}>
          Post-trip sentiment analysis, reputation management, escalations
        </p>
      </div>

      {/* Metrics Row (3 KPI cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Average Rating</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Star size={24} color="#F59E0B" fill="#F59E0B" /> 4.8 / 5.0
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>High satisfaction</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Net Promoter Score</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <HeartHandshake size={24} color="#10B981" /> 82
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>Excellent</div>
         </div>
         <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px' }}>Total Reviews</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <MessageSquare size={24} color="#3B82F6" /> 864
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>+24 this month</div>
         </div>
      </div>

      {/* Reviews Grid (2 columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
         {mockReviews.map(review => (
            <div key={review.id} style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {/* Header */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                        {review.guest_initials}
                     </div>
                     <div>
                        <div style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           {review.guest_name} 
                           <Badge variant={review.status === 'Featured' ? 'quote' : 'default'}>{review.status}</Badge>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>{review.expedition} • {review.dates}</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                     {renderStars(review.rating)}
                  </div>
               </div>

               {/* Body */}
               <div>
                  <div style={{ fontStyle: 'italic', color: '#4B5563', fontSize: '14px', lineHeight: '1.6' }}>
                     "{review.review_text}"
                  </div>
               </div>

               {/* Footer */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{review.submitted_time}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <Button variant="secondary" style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '12px' }} icon={<AlertTriangle size={14} />}>Escalate</Button>
                     <Button variant="primary" style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '12px' }} icon={<MessageSquare size={14} />}>Reply</Button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </>
  )
}
