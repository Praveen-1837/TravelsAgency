'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';
import { AdminUser, AdminStats, CallbackRecord, Package, Review } from '@/lib/types';
import {
  fetchAdminStats,
  fetchAdminCallbacks,
  updateAdminCallback,
  deleteAdminCallback,
  fetchAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  toggleAdminPackageActive,
  deleteAdminPackage,
  fetchAdminReviews,
  approveAdminReview,
  rejectAdminReview,
  createAdminReview,
} from '@/lib/api';
import { CallbackDetailModal } from '@/components/admin/CallbackDetailModal';
import { PackageFormModal } from '@/components/admin/PackageFormModal';
import { ManualReviewModal } from '@/components/admin/ManualReviewModal';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth State
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'callbacks' | 'packages' | 'reviews'>(
    'overview'
  );

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [callbacks, setCallbacks] = useState<CallbackRecord[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Filter & Search
  const [callbackFilter, setCallbackFilter] = useState<string>('all');
  const [callbackSearch, setCallbackSearch] = useState<string>('');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Modals
  const [selectedCallback, setSelectedCallback] = useState<CallbackRecord | null>(null);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

  const [packageToEdit, setPackageToEdit] = useState<Package | null>(null);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  const [isManualReviewModalOpen, setIsManualReviewModalOpen] = useState(false);

  // 1. Check Authentication & Fetch Dashboard Data on Mount
  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      const savedToken = localStorage.getItem('aariva_admin_token');
      const savedUserStr = localStorage.getItem('aariva_admin_user');

      if (!savedToken) {
        router.push('/admin/login');
        return;
      }

      if (savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          if (isMounted) setUser(parsedUser);
        } catch {}
      }

      if (isMounted) {
        setToken(savedToken);
        setLoading(true);
      }

      try {
        const [sData, cData, pData, rData] = await Promise.all([
          fetchAdminStats(savedToken),
          fetchAdminCallbacks(savedToken),
          fetchAdminPackages(savedToken),
          fetchAdminReviews(savedToken),
        ]);
        if (isMounted) {
          setStats(sData);
          setCallbacks(cData);
          setPackages(pData);
          setReviews(rData);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Sign out
  const handleLogout = () => {
    localStorage.removeItem('aariva_admin_token');
    localStorage.removeItem('aariva_admin_user');
    document.cookie = 'aariva_admin_token=; path=/; max-age=0';
    router.push('/admin/login');
  };

  // Callback Updates
  const handleUpdateCallback = async (
    id: string,
    updates: { status?: CallbackRecord['status']; notes?: string; assigned_to?: string }
  ) => {
    if (!token) return;
    await updateAdminCallback(token, id, updates);
    // Refresh callbacks
    const updated = await fetchAdminCallbacks(token);
    setCallbacks(updated);
    const updatedStats = await fetchAdminStats(token);
    setStats(updatedStats);
  };

  const handleDeleteCallback = async (id: string) => {
    if (!token) return;
    await deleteAdminCallback(token, id);
    setCallbacks(callbacks.filter((c) => c.id !== id));
  };

  // Package Updates
  const handleSavePackage = async (data: Partial<Package>) => {
    if (!token) return;
    if (packageToEdit) {
      await updateAdminPackage(token, packageToEdit.id, data);
    } else {
      await createAdminPackage(token, data);
    }
    const updatedPkgs = await fetchAdminPackages(token);
    setPackages(updatedPkgs);
  };

  const handleTogglePackage = async (id: string) => {
    if (!token) return;
    await toggleAdminPackageActive(token, id);
    setPackages(packages.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)));
  };

  const handleDeletePackage = async (id: string) => {
    if (!token) return;
    if (confirm('Are you sure you want to deactivate/delete this package?')) {
      await deleteAdminPackage(token, id);
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  // Review Moderation
  const handleApproveReview = async (id: string) => {
    if (!token) return;
    await approveAdminReview(token, id);
    setReviews(reviews.map((r) => (r.id === id ? { ...r, is_approved: true } : r)));
    const updatedStats = await fetchAdminStats(token);
    setStats(updatedStats);
  };

  const handleRejectReview = async (id: string) => {
    if (!token) return;
    if (confirm('Are you sure you want to remove this review?')) {
      await rejectAdminReview(token, id);
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const handleCreateManualReview = async (data: Omit<Review, 'id' | 'created_at'>) => {
    if (!token) return;
    await createAdminReview(token, data);
    const updated = await fetchAdminReviews(token);
    setReviews(updated);
  };

  // Filtered lists
  const filteredCallbacks = useMemo(() => {
    let list = [...callbacks];
    if (callbackFilter !== 'all') {
      list = list.filter((c) => c.status === callbackFilter);
    }
    if (callbackSearch.trim()) {
      const q = callbackSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }
    return list;
  }, [callbacks, callbackFilter, callbackSearch]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'pending') {
      return reviews.filter((r) => !r.is_approved);
    }
    if (reviewFilter === 'approved') {
      return reviews.filter((r) => r.is_approved);
    }
    return reviews;
  }, [reviews, reviewFilter]);

  const newCallbacksCount = callbacks.filter((c) => c.status === 'new').length;
  const pendingReviewsCount = reviews.filter((r) => !r.is_approved).length;

  if (!token) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className={styles.adminRoot}>
      {/* 1. Sticky Top Navigation Bar */}
      <header className={styles.topNav}>
        <div className={styles.navBrand}>
          <Image
            src="/images/logo.png"
            alt="Aariva Voyages Logo"
            width={130}
            height={36}
            style={{ objectFit: 'contain' }}
            priority
          />
          <span className={styles.adminBadge}>
            {user?.role === 'admin' ? 'OPERATIONS ADMIN' : 'STAFF MARSHAL'}
          </span>
        </div>

        <div className={styles.navUserSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'Aariva Team Member'}</span>
            <span className={styles.userRole}>{user?.email || 'admin@aarivavoyages.com'}</span>
          </div>

          <Link href="/" target="_blank" className={styles.publicSiteLink}>
            🌐 View Public Site ↗
          </Link>

          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. Shell Layout (Sidebar + Main View) */}
      <div className={styles.dashboardShell}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.tabLabelGroup}>
              <span>📊</span>
              <span>Overview</span>
            </span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'callbacks' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('callbacks')}
          >
            <span className={styles.tabLabelGroup}>
              <span>📞</span>
              <span>Callbacks</span>
            </span>
            {newCallbacksCount > 0 && (
              <span className={styles.tabBadge}>{newCallbacksCount} New</span>
            )}
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'packages' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <span className={styles.tabLabelGroup}>
              <span>🗺️</span>
              <span>Packages</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--neutral-medium)' }}>{packages.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <span className={styles.tabLabelGroup}>
              <span>⭐</span>
              <span>Reviews</span>
            </span>
            {pendingReviewsCount > 0 && (
              <span className={styles.tabBadge} style={{ backgroundColor: '#f59e0b' }}>
                {pendingReviewsCount}
              </span>
            )}
          </button>
        </aside>

        {/* Main Workspace */}
        <main className={styles.mainArea}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--neutral-medium)' }}>
              Loading operational dashboard data...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  <div className={styles.pageHeader}>
                    <div className={styles.headerTitles}>
                      <h1>Operations Overview</h1>
                      <p>Real-time inquiry trends, conversion analytics, and pending requests.</p>
                    </div>

                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => setActiveTab('callbacks')}
                    >
                      📞 View All Inquiries ({callbacks.length})
                    </button>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.highlightCard}`}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Pending Callback</span>
                        <span className={styles.statIcon}>🔥</span>
                      </div>
                      <span className={styles.statValue}>
                        {stats?.new_inquiries ?? newCallbacksCount}
                      </span>
                      <span className={styles.statSubtext}>Requires team contact</span>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Inquiries</span>
                        <span className={styles.statIcon}>📋</span>
                      </div>
                      <span className={styles.statValue}>{stats?.total_inquiries ?? 48}</span>
                      <span className={styles.statSubtext}>Lifetime customer requests</span>
                    </div>

                    <div className={`${styles.statCard} ${styles.successCard}`}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Conversion Rate</span>
                        <span className={styles.statIcon}>📈</span>
                      </div>
                      <span className={styles.statValue}>{stats?.conversion_rate ?? '25%'}</span>
                      <span className={styles.statSubtext}>
                        {stats?.converted ?? 12} converted bookings
                      </span>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Pending Reviews</span>
                        <span className={styles.statIcon}>⭐</span>
                      </div>
                      <span className={styles.statValue}>
                        {stats?.pending_reviews ?? pendingReviewsCount}
                      </span>
                      <span className={styles.statSubtext}>Awaiting moderation</span>
                    </div>
                  </div>

                  {/* Overview Widgets */}
                  <div className={styles.overviewGrid}>
                    <div className={styles.widgetBox}>
                      <h3 className={styles.widgetTitle}>Top Performing Packages</h3>
                      <div className={styles.topPackagesList}>
                        {(stats?.top_packages || []).map((pkg, idx) => (
                          <div key={idx} className={styles.topPackageItem}>
                            <div className={styles.topPackageMeta}>
                              <span>{pkg.title}</span>
                              <span style={{ color: 'var(--secondary)' }}>
                                {pkg.count} inquiries ({pkg.conversion})
                              </span>
                            </div>
                            <div className={styles.topPackageBarTrack}>
                              <div
                                className={styles.topPackageBarFill}
                                style={{ width: `${Math.min(100, pkg.count * 5)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.widgetBox}>
                      <h3 className={styles.widgetTitle}>Recent Urgent Callback Requests</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {callbacks.slice(0, 4).map((cb) => (
                          <div
                            key={cb.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem',
                              backgroundColor: 'var(--surface-base)',
                              borderRadius: '6px',
                              border: '1px solid var(--neutral-light)',
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '0.875rem' }}>{cb.name}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-medium)' }}>
                                📞 +91 {cb.phone} • {cb.status.toUpperCase()}
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.actionIconBtn}
                              onClick={() => {
                                setSelectedCallback(cb);
                                setIsCallbackModalOpen(true);
                              }}
                            >
                              Manage →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CALLBACK REQUESTS */}
              {activeTab === 'callbacks' && (
                <div>
                  <div className={styles.pageHeader}>
                    <div className={styles.headerTitles}>
                      <h1>Callback Inquiries</h1>
                      <p>
                        Review incoming traveler inquiries, follow up via WhatsApp/phone, and track
                        status.
                      </p>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className={styles.filterBar}>
                    <div className={styles.filterPills}>
                      {['all', 'new', 'contacted', 'converted', 'closed'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`${styles.filterPill} ${callbackFilter === st ? styles.activeFilterPill : ''}`}
                          onClick={() => setCallbackFilter(st)}
                        >
                          {st.toUpperCase()}
                          {st === 'new' && newCallbacksCount > 0 && ` (${newCallbacksCount})`}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="🔍 Search name, phone, or email..."
                      value={callbackSearch}
                      onChange={(e) => setCallbackSearch(e.target.value)}
                    />
                  </div>

                  {/* Table */}
                  <div className={styles.tableContainer}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Traveler Name</th>
                          <th>Contact</th>
                          <th>Package Inquired</th>
                          <th>Travel Dates</th>
                          <th>Status</th>
                          <th>Assignee</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCallbacks.length > 0 ? (
                          filteredCallbacks.map((cb) => {
                            const cleanPhone = cb.phone.replace(/\D/g, '');
                            const waNum = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                            let statusClass = styles.statusNew;
                            if (cb.status === 'contacted') statusClass = styles.statusContacted;
                            else if (cb.status === 'converted')
                              statusClass = styles.statusConverted;
                            else if (cb.status === 'closed') statusClass = styles.statusClosed;

                            return (
                              <tr key={cb.id}>
                                <td>
                                  <strong>{cb.name}</strong>
                                  <div style={{ fontSize: '0.6875rem', color: 'var(--neutral-medium)' }}>
                                    {new Date(cb.created_at).toLocaleDateString('en-IN')}
                                  </div>
                                </td>
                                <td>
                                  <div>+91 {cb.phone}</div>
                                  {cb.email && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-medium)' }}>
                                      {cb.email}
                                    </div>
                                  )}
                                </td>
                                <td>{cb.package_title || 'General Customization'}</td>
                                <td>
                                  {cb.travel_from || 'Flexible'} ({cb.group_size || 2} pax)
                                </td>
                                <td>
                                  <span className={`${styles.statusBadge} ${statusClass}`}>
                                    {cb.status}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontSize: '0.8125rem' }}>
                                    {cb.assigned_to || '—'}
                                  </span>
                                </td>
                                <td>
                                  <div className={styles.tableActions}>
                                    <a
                                      href={`tel:+91${cleanPhone}`}
                                      className={`${styles.actionIconBtn} ${styles.actionCallBtn}`}
                                      title="Call Customer"
                                    >
                                      📞
                                    </a>
                                    <a
                                      href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Hello ${cb.name}, greetings from Aariva Voyages! We received your callback inquiry.`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={`${styles.actionIconBtn} ${styles.actionWhatsAppBtn}`}
                                      title="WhatsApp Customer"
                                    >
                                      💬
                                    </a>
                                    <button
                                      type="button"
                                      className={styles.actionIconBtn}
                                      onClick={() => {
                                        setSelectedCallback(cb);
                                        setIsCallbackModalOpen(true);
                                      }}
                                    >
                                      Details
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className={styles.emptyState}>
                              No callback requests found matching current filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: PACKAGES MANAGEMENT */}
              {activeTab === 'packages' && (
                <div>
                  <div className={styles.pageHeader}>
                    <div className={styles.headerTitles}>
                      <h1>Tour Packages Management</h1>
                      <p>
                        Create new itineraries, update pricing, and activate/deactivate packages.
                      </p>
                    </div>

                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => {
                        setPackageToEdit(null);
                        setIsPackageModalOpen(true);
                      }}
                    >
                      + Create New Package
                    </button>
                  </div>

                  <div className={styles.packagesAdminGrid}>
                    {packages.map((pkg) => (
                      <div key={pkg.id} className={styles.packageAdminCard}>
                        <div className={styles.packageImgFrame}>
                          <Image
                            src={
                              pkg.images[0] ||
                              'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
                            }
                            alt={pkg.title}
                            fill
                            sizes="320px"
                            style={{ objectFit: 'cover' }}
                          />
                          <span
                            className={`${styles.packageActiveBadge} ${pkg.is_active ? styles.badgeActive : styles.badgeInactive}`}
                          >
                            {pkg.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className={styles.packageCardBody}>
                          <h4 className={styles.pkgTitle}>{pkg.title}</h4>
                          <div className={styles.pkgMetaRow}>
                            <span>📍 {pkg.destination}</span>
                            <span>⏳ {pkg.duration}</span>
                          </div>
                          <div className={styles.pkgMetaRow}>
                            <span className={styles.pkgPrice}>
                              ₹{pkg.price_per_person.toLocaleString('en-IN')}{' '}
                              <small style={{ fontSize: '0.6875rem', color: 'var(--neutral-medium)' }}>
                                / {pkg.price_unit}
                              </small>
                            </span>
                            <span style={{ fontSize: '0.8125rem' }}>
                              ★ {pkg.rating_avg} ({pkg.review_count})
                            </span>
                          </div>
                        </div>

                        <div className={styles.pkgCardFooter}>
                          <button
                            type="button"
                            className={styles.actionIconBtn}
                            onClick={() => handleTogglePackage(pkg.id)}
                          >
                            {pkg.is_active ? 'Deactivate' : 'Activate'}
                          </button>

                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            <button
                              type="button"
                              className={styles.actionIconBtn}
                              onClick={() => {
                                setPackageToEdit(pkg);
                                setIsPackageModalOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className={styles.rejectBtn}
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEWS MODERATION */}
              {activeTab === 'reviews' && (
                <div>
                  <div className={styles.pageHeader}>
                    <div className={styles.headerTitles}>
                      <h1>Reviews Moderation</h1>
                      <p>
                        Approve user-submitted feedback, remove spam, and manually record reviews
                        from offline channels.
                      </p>
                    </div>

                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => setIsManualReviewModalOpen(true)}
                    >
                      + Add Review Manually
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className={styles.filterBar}>
                    <div className={styles.filterPills}>
                      <button
                        type="button"
                        className={`${styles.filterPill} ${reviewFilter === 'all' ? styles.activeFilterPill : ''}`}
                        onClick={() => setReviewFilter('all')}
                      >
                        All Reviews ({reviews.length})
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterPill} ${reviewFilter === 'pending' ? styles.activeFilterPill : ''}`}
                        onClick={() => setReviewFilter('pending')}
                      >
                        Pending Moderation ({pendingReviewsCount})
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterPill} ${reviewFilter === 'approved' ? styles.activeFilterPill : ''}`}
                        onClick={() => setReviewFilter('approved')}
                      >
                        Published &amp; Approved
                      </button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className={styles.reviewsAdminList}>
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className={`${styles.reviewAdminCard} ${!rev.is_approved ? styles.reviewPendingCard : ''}`}
                        >
                          <div className={styles.reviewCardHeader}>
                            <div className={styles.travelerInfo}>
                              <h4>{rev.traveler_name}</h4>
                              <span className={styles.tripTag}>
                                {rev.trip_label || 'Verified Guest'} •{' '}
                                {new Date(rev.created_at).toLocaleDateString('en-IN')}
                              </span>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div className={styles.reviewStars}>{'★'.repeat(rev.rating)}</div>
                              <span
                                style={{
                                  fontSize: '0.6875rem',
                                  fontWeight: 800,
                                  color: rev.is_approved ? '#006c49' : '#b45309',
                                }}
                              >
                                {rev.is_approved ? 'APPROVED' : 'PENDING APPROVAL'}
                              </span>
                            </div>
                          </div>

                          <p className={styles.reviewText}>{rev.comment}</p>

                          {rev.photos && rev.photos.length > 0 && (
                            <div className={styles.reviewPhotosRow}>
                              {rev.photos.map((photo, i) => (
                                <div key={i} className={styles.reviewPhotoThumb}>
                                  <Image
                                    src={photo}
                                    alt="Review photo"
                                    fill
                                    sizes="60px"
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className={styles.reviewCardFooter}>
                            <span>Package ID: {rev.package_id}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {!rev.is_approved && (
                                <button
                                  type="button"
                                  className={styles.approveBtn}
                                  onClick={() => handleApproveReview(rev.id)}
                                >
                                  ✓ Approve Review
                                </button>
                              )}
                              <button
                                type="button"
                                className={styles.rejectBtn}
                                onClick={() => handleRejectReview(rev.id)}
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>
                        No reviews found matching current filter.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. MODALS */}
      <CallbackDetailModal
        isOpen={isCallbackModalOpen}
        onClose={() => {
          setIsCallbackModalOpen(false);
          setSelectedCallback(null);
        }}
        callback={selectedCallback}
        onUpdate={handleUpdateCallback}
        onDelete={handleDeleteCallback}
      />

      <PackageFormModal
        isOpen={isPackageModalOpen}
        onClose={() => {
          setIsPackageModalOpen(false);
          setPackageToEdit(null);
        }}
        packageToEdit={packageToEdit}
        onSave={handleSavePackage}
      />

      <ManualReviewModal
        isOpen={isManualReviewModalOpen}
        onClose={() => setIsManualReviewModalOpen(false)}
        packages={packages}
        onSubmit={handleCreateManualReview}
      />
    </div>
  );
}
