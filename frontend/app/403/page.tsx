export default function ForbiddenPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
      <div className="text-center p-8 bg-white shadow-card rounded-xl border border-[#E2E8F0]">
        <h1 className="text-4xl font-bold text-[#0A2540] mb-4">403</h1>
        <h2 className="text-xl font-semibold text-[#0F172A] mb-2">Access Denied</h2>
        <p className="text-[#475569] mb-6">You do not have permission to access the admin dashboard.</p>
        <a href="/" className="inline-flex items-center justify-center bg-[#0A2540] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1E3A8A] transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  )
}
