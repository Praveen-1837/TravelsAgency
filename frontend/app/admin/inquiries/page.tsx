'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { client } from '@/sanity/lib/client';
import { PACKAGES_BY_IDS_QUERY } from '@/sanity/lib/queries';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertData, setConvertData] = useState({ travel_date: '', travelers: 2, total_amount: 0 });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data: inqData, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (inqData && inqData.length > 0) {
      const packageIds = [...new Set(inqData.map(i => i.package_id).filter(Boolean))];
      let sanityPackages = [];
      if (packageIds.length > 0) {
        try {
          sanityPackages = await client.fetch(PACKAGES_BY_IDS_QUERY, { ids: packageIds });
        } catch (err) {
          console.error("Sanity fetch error:", err);
        }
      }

      const enriched = inqData.map(inq => ({
        ...inq,
        package: sanityPackages.find((p: any) => p._id === inq.package_id)
      }));
      setInquiries(enriched);
    } else {
      setInquiries([]);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedInquiry) return;
    
    let updates: any = { status: updateStatus, admin_notes: adminNotes };
    if (updateStatus === 'contacted' && selectedInquiry.status !== 'contacted') {
      updates.contacted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', selectedInquiry.id);

    if (!error) {
      setIsModalOpen(false);
      fetchInquiries();
    } else {
      alert("Error updating inquiry");
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    // Create booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: selectedInquiry.user_id, // Might be null for anon inquiries
        inquiry_id: selectedInquiry.id,
        package_id: selectedInquiry.package_id,
        package_slug: selectedInquiry.package_slug,
        package_title: selectedInquiry.package_title,
        travel_date: convertData.travel_date,
        travelers: convertData.travelers,
        total_amount: convertData.total_amount,
        status: 'pending',
      });

    if (bookingError) {
      alert("Error creating booking: " + bookingError.message);
      return;
    }

    // Mark inquiry as closed
    await supabase.from('inquiries').update({ status: 'closed' }).eq('id', selectedInquiry.id);
    
    setIsConvertModalOpen(false);
    setIsModalOpen(false);
    fetchInquiries();
  };

  const filteredInquiries = inquiries.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!i.name?.toLowerCase().includes(q) && 
          !i.phone?.includes(q) && 
          !i.package_title?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500">Manage callback requests.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm font-medium ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="Search name, phone..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-slate-900 outline-none"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Package</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Travel Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Created</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading inquiries...</td></tr>
              ) : filteredInquiries.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No inquiries found.</td></tr>
              ) : (
                filteredInquiries.map(inq => (
                  <tr key={inq.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-900 font-medium">{inq.name}</td>
                    <td className="p-4 text-sm text-gray-600">{inq.phone}</td>
                    <td className="p-4 text-sm text-gray-600">{inq.package?.title || inq.package_title || 'General'}</td>
                    <td className="p-4 text-sm text-gray-600">{inq.travel_date ? new Date(inq.travel_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        inq.status === 'new' ? 'bg-gray-100 text-gray-800' : 
                        inq.status === 'closed' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setUpdateStatus(inq.status);
                          setAdminNotes(inq.admin_notes || '');
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

      {isModalOpen && selectedInquiry && !isConvertModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Inquiry</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Traveler Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 w-24 inline-block">Name:</span> {selectedInquiry.name}</p>
                  <p><span className="text-gray-500 w-24 inline-block">Phone:</span> {selectedInquiry.phone}</p>
                  <p><span className="text-gray-500 w-24 inline-block">Email:</span> {selectedInquiry.email || 'N/A'}</p>
                  <p><span className="text-gray-500 w-24 inline-block">Date:</span> {selectedInquiry.travel_date || 'N/A'}</p>
                  <p><span className="text-gray-500 w-24 inline-block">Group Size:</span> {selectedInquiry.group_size || 2}</p>
                </div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">Package</h3>
                <p className="text-sm font-medium">{selectedInquiry.package?.title || selectedInquiry.package_title || 'General Customization'}</p>
                
                {selectedInquiry.special_requests && (
                  <>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Message/Notes</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedInquiry.special_requests}</p>
                  </>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Admin Controls</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={updateStatus}
                      onChange={e => setUpdateStatus(e.target.value)}
                      className="w-full border rounded p-2 text-sm focus:ring-slate-900 outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                    <textarea 
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full border rounded p-2 text-sm focus:ring-slate-900 outline-none"
                      placeholder="Add internal notes here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <button 
                onClick={() => setIsConvertModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition"
              >
                Create Booking
              </button>
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
                <button onClick={handleUpdate} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isConvertModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <form onSubmit={handleConvert} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Create Booking from Inquiry</h2>
            <p className="text-sm text-gray-500 mb-6">This will create a new pending booking and close this inquiry.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Travel Date</label>
                <input 
                  type="date" 
                  required
                  value={convertData.travel_date}
                  onChange={e => setConvertData({...convertData, travel_date: e.target.value})}
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Travelers</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={convertData.travelers}
                  onChange={e => setConvertData({...convertData, travelers: Number(e.target.value)})}
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estimated Total Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  value={convertData.total_amount}
                  onChange={e => setConvertData({...convertData, total_amount: Number(e.target.value)})}
                  className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsConvertModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 border rounded">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">Create Booking</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
