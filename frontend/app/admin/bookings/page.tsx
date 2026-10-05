'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { client } from '@/sanity/lib/client';
import { PACKAGES_BY_IDS_QUERY } from '@/sanity/lib/queries';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState({ package_id: '', package_title: '', travel_date: '', travelers: 2, total_amount: 0 });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    // Join with profiles (if customer is linked) and payments
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles ( full_name, email ),
        payments ( id, amount, status )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      const packageIds = [...new Set(data.map(i => i.package_id).filter(Boolean))];
      let sanityPackages = [];
      if (packageIds.length > 0) {
        try {
          sanityPackages = await client.fetch(PACKAGES_BY_IDS_QUERY, { ids: packageIds });
        } catch (err) {
          console.error("Sanity fetch error:", err);
        }
      }

      const enriched = data.map(b => ({
        ...b,
        package: sanityPackages.find((p: any) => p._id === b.package_id)
      }));
      setBookings(enriched);
    } else {
      setBookings([]);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedBooking) return;
    
    const { error } = await supabase
      .from('bookings')
      .update({ status: updateStatus })
      .eq('id', selectedBooking.id);

    if (!error) {
      setIsModalOpen(false);
      fetchBookings();
    } else {
      alert("Error updating booking");
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    if (confirm("Are you sure you want to cancel this booking?")) {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', selectedBooking.id);
      if (!error) {
        setIsModalOpen(false);
        fetchBookings();
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('bookings')
      .insert({
        package_id: createData.package_id || null,
        package_title: createData.package_title || 'Custom Tour',
        travel_date: createData.travel_date,
        travelers: createData.travelers,
        total_amount: createData.total_amount,
        status: 'pending',
      });
    
    if (error) {
      alert("Error creating booking: " + error.message);
    } else {
      setIsCreateModalOpen(false);
      fetchBookings();
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage customer trips and itineraries.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800"
        >
          + Create Booking
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
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
                <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Package</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Travel Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No bookings found.</td></tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 font-mono">{b.id.slice(0, 8)}...</td>
                    <td className="p-4 text-sm text-gray-900 font-medium">{b.profiles?.full_name || 'Guest / Unlinked'}</td>
                    <td className="p-4 text-sm text-gray-600">{b.package?.title || b.package_title || 'Custom Tour'}</td>
                    <td className="p-4 text-sm text-gray-600">{new Date(b.travel_date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm font-medium">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        b.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedBooking(b);
                          setUpdateStatus(b.status);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Booking</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 w-24 inline-block">ID:</span> <span className="font-mono text-xs">{selectedBooking.id}</span></p>
                  <p><span className="text-gray-500 w-24 inline-block">Customer:</span> {selectedBooking.profiles?.full_name || 'Unlinked'}</p>
                  <p><span className="text-gray-500 w-24 inline-block">Travel Date:</span> {new Date(selectedBooking.travel_date).toLocaleDateString()}</p>
                  <p><span className="text-gray-500 w-24 inline-block">Travelers:</span> {selectedBooking.travelers}</p>
                  <p><span className="text-gray-500 w-24 inline-block">Total Amount:</span> ₹{Number(selectedBooking.total_amount).toLocaleString('en-IN')}</p>
                </div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Linked Package</h3>
                <p className="text-sm font-medium">{selectedBooking.package?.title || selectedBooking.package_title || 'Custom Tour'}</p>
                
                {selectedBooking.inquiry_id && (
                  <p className="text-xs text-gray-500 mt-2 font-mono">Linked Inquiry: {selectedBooking.inquiry_id}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Payments</h3>
                {selectedBooking.payments && selectedBooking.payments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBooking.payments.map((p: any) => (
                      <div key={p.id} className="border p-3 rounded text-sm bg-gray-50 flex justify-between items-center">
                        <span>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-200'}`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No payments recorded yet.</p>
                )}

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Status</h3>
                <div className="space-y-4">
                  <select 
                    value={updateStatus}
                    onChange={e => setUpdateStatus(e.target.value)}
                    className="w-full border rounded p-2 text-sm focus:ring-slate-900 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <button 
                onClick={handleCancel}
                className="text-red-600 text-sm font-medium hover:underline"
              >
                Cancel Booking
              </button>
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100">Close</button>
                <button onClick={handleUpdate} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800">Save Status</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Create Manual Booking</h2>
            <p className="text-sm text-gray-500 mb-6">Create a booking record for manual/offline sales.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Package Title (Custom)</label>
                <input 
                  type="text" 
                  value={createData.package_title}
                  onChange={e => setCreateData({...createData, package_title: e.target.value})}
                  placeholder="e.g. 3N Kerala Trip"
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Travel Date</label>
                <input 
                  type="date" 
                  required
                  value={createData.travel_date}
                  onChange={e => setCreateData({...createData, travel_date: e.target.value})}
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Travelers</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={createData.travelers}
                  onChange={e => setCreateData({...createData, travelers: Number(e.target.value)})}
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  value={createData.total_amount}
                  onChange={e => setCreateData({...createData, total_amount: Number(e.target.value)})}
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 border rounded">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
