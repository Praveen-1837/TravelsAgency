import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Aariva Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-800">
            Dashboard
          </Link>
          <Link href="/admin/inquiries" className="block px-4 py-2 rounded hover:bg-slate-800">
            Inquiries
          </Link>
          <Link href="/admin/bookings" className="block px-4 py-2 rounded hover:bg-slate-800">
            Bookings
          </Link>
          <Link href="/admin/payments" className="block px-4 py-2 rounded hover:bg-slate-800">
            Payments
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <form action="/auth/signout" method="post">
            <button type="submit" className="w-full px-4 py-2 text-sm text-left hover:bg-slate-800 rounded">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
