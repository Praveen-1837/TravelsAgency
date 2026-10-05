'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        bookings ( id, package_title )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setPayments(data || []);
    setLoading(false);
  };

  const handleMarkAsPaid = async () => {
    if (!selectedPayment) return;
    
    if (confirm("Mark this payment as Paid manually?")) {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'paid' })
        .eq('id', selectedPayment.id);

      if (!error) {
        setIsModalOpen(false);
        fetchPayments();
      } else {
        alert("Error marking payment as paid: " + error.message);
      }
    }
  };

  const handleRefund = async () => {
    if (!selectedPayment) return;
    
    // In a real app, you would call your backend endpoint (/api/payments/:id/refund) here to hit Razorpay API
    // For now, we just update the DB status manually to 'refunded'
    if (confirm("Are you sure you want to refund this payment? This action should also trigger the gateway refund in a real environment.")) {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', selectedPayment.id);

      if (!error) {
        setIsModalOpen(false);
        fetchPayments();
      } else {
        alert("Error refunding payment: " + error.message);
      }
    }
  };

  const filteredPayments = payments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Track and manage transactions.</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'created', 'paid', 'failed', 'refunded'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Booking</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Gateway Order ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Created</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading payments...</td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No payments found.</td></tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 font-mono">{p.id.slice(0, 8)}...</td>
                    <td className="p-4 text-sm text-gray-600">
                      {p.bookings?.package_title || `Booking ${p.booking_id.slice(0, 8)}`}
                    </td>
                    <td className="p-4 text-sm font-medium">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td className="p-4 text-sm text-gray-500 font-mono">{p.razorpay_order_id || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        p.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        p.status === 'created' ? 'bg-blue-100 text-blue-800' : 
                        p.status === 'refunded' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedPayment(p);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Payment Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Amount</p>
                  <p className="text-xl font-bold">₹{Number(selectedPayment.amount).toLocaleString('en-IN')} {selectedPayment.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        selectedPayment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        selectedPayment.status === 'created' ? 'bg-blue-100 text-blue-800' : 
                        selectedPayment.status === 'refunded' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">IDs & References</h3>
                  <div className="space-y-2 text-sm font-mono break-all">
                    <p><span className="text-gray-500 font-sans text-xs w-24 inline-block">Payment ID:</span> {selectedPayment.id}</p>
                    <p><span className="text-gray-500 font-sans text-xs w-24 inline-block">Order ID:</span> {selectedPayment.razorpay_order_id || 'N/A'}</p>
                    <p><span className="text-gray-500 font-sans text-xs w-24 inline-block">RZP Payment ID:</span> {selectedPayment.razorpay_payment_id || 'N/A'}</p>
                    <p><span className="text-gray-500 font-sans text-xs w-24 inline-block">Booking ID:</span> {selectedPayment.booking_id}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions</h3>
                  <div className="space-y-3">
                    {selectedPayment.status === 'failed' || selectedPayment.status === 'created' ? (
                      <button 
                        onClick={handleMarkAsPaid}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition"
                      >
                        Manually Mark as Paid
                      </button>
                    ) : null}

                    {selectedPayment.status === 'paid' ? (
                      <button 
                        onClick={handleRefund}
                        className="w-full border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50 transition"
                      >
                        Refund Payment
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
