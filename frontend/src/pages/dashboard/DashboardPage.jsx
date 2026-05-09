import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { getAssets } from '../../api/assetApi'
import { getDashboardStats } from '../../api/dashboardApi'
import { getHistoryByUser } from '../../api/historyApi'
import StatCard from '../../components/cards/StatCard'
import AssetChart from '../../components/charts/AssetChart'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './DashboardPage.css'

// ── SVG Icons for stat cards ────────────────────────────────

const icons = {
  total: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2 0v14h12V5H6zm2 3h8v2H8V8zm0 4h5v2H8v-2z" />
    </svg>
  ),
  assigned: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
    </svg>
  ),
  available: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  ),
  expiring: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  reports: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM19 14.9L14.9 19H9.1L5 14.9V9.1L9.1 5h5.8L19 9.1v5.8zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z" />
    </svg>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const isDeveloper = user?.roleId === 0
  const [assets, setAssets] = useState([])
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        if (user?.roleId > 0) {
          // Admin/Manager use dashboard API
          const statsRes = await getDashboardStats()
          setStats(statsRes.data)
        } else {
          // Normal user manually fetches their assets
          const assetsRes = await getAssets()
          setAssets(assetsRes.data?.content || assetsRes.data || [])
        }

        // Try to fetch recent history for the current user
        if (user?.id) {
          try {
            const histRes = await getHistoryByUser(user.id)
            const histList = histRes.data?.content || histRes.data || []
            setRecentActivity(histList.slice(0, 5))
          } catch {
            setRecentActivity([])
          }
        }
      } catch {
        // API not available yet — graceful fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  // ── Compute stats ───────────────────────────────────────

  let totalAssets = 0
  let assignedAssets = 0
  let availableAssets = 0
  let typeCounts = {}

  if (stats) {
    totalAssets = stats.totalAssets || 0
    // Case-insensitive lookup — backend may return "AVAILABLE" while we expect "Available"
    const statusDist = stats.statusDistribution || {}
    const availableKey = Object.keys(statusDist).find(
      (k) => k.toLowerCase() === 'available'
    )
    availableAssets = availableKey ? statusDist[availableKey] : 0
    assignedAssets = totalAssets - availableAssets
    typeCounts = stats.typeDistribution || {}
  } else {
    totalAssets = assets.length
    assignedAssets = assets.filter((a) => a.status?.toUpperCase() === 'ASSIGNED').length
    availableAssets = totalAssets - assignedAssets

    assets.forEach((a) => {
      const t = a.type || 'Other'
      typeCounts[t] = (typeCounts[t] || 0) + 1
    })
  }

  // ── Chart data ──────────────────────────────────────────

  const typeLabels = Object.keys(typeCounts)
  const typeValues = Object.values(typeCounts)
  const typeColors = ['#4c6ef5', '#40c057', '#fab005', '#fa5252', '#339af0', '#845ef7']

  const allocationLabels = ['Assigned', 'Available']
  const allocationValues = [assignedAssets, availableAssets]
  const allocationColors = ['#4c6ef5', '#40c057']

  // ── Helpers ─────────────────────────────────────────────

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  // ── Render ──────────────────────────────────────────────

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user?.firstName || 'User'}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading dashboard data…" />
      ) : (
        <>
          {/* Stat Cards Row */}
          {!isDeveloper && (
            <div className="dashboard-page__stats">
              <StatCard
                title="Total Assets"
                value={totalAssets}
                icon={icons.total}
                color="primary"
              />
              <StatCard
                title="Assigned"
                value={assignedAssets}
                icon={icons.assigned}
                color="info"
              />
              <StatCard
                title="Available"
                value={availableAssets}
                icon={icons.available}
                color="success"
              />
              {stats ? (
                <>
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers || 0}
                    icon={icons.users}
                    color="warning"
                  />
                  <StatCard
                    title="Active Reports"
                    value={stats.activeReports || 0}
                    icon={icons.reports}
                    color="warning"
                  />
                </>
              ) : (
                <StatCard
                  title="Total Assets"
                  value={totalAssets}
                  icon={icons.total}
                  color="warning"
                />
              )}
            </div>
          )}

          {/* Charts Row */}
          <div className="dashboard-page__charts">
            <AssetChart
              type="doughnut"
              title="Assets by Type"
              labels={typeLabels.length ? typeLabels : ['No data']}
              values={typeValues.length ? typeValues : [1]}
              colors={typeLabels.length ? typeColors : ['#e9ecef']}
            />
            {!isDeveloper && (
              <AssetChart
                type="bar"
                title="Allocation Status"
                labels={allocationLabels}
                values={allocationValues}
                colors={allocationColors}
              />
            )}
          </div>

          {/* Recent Activity */}
          <div className="dashboard-page__activity card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="card-body">
              {recentActivity.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-8) 0' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 'var(--space-3)', opacity: 0.4 }}>
                    <circle cx="24" cy="24" r="22" stroke="var(--gray-300)" strokeWidth="2" />
                    <path d="M24 14v12l8 4" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <h3>No recent activity</h3>
                  <p>Asset transfers and updates will appear here.</p>
                </div>
              ) : (
                <div className="dashboard-page__timeline">
                  {recentActivity.map((entry, idx) => (
                    <div key={entry.id || idx} className="dashboard-page__timeline-item">
                      <div className="dashboard-page__timeline-dot" />
                      <div className="dashboard-page__timeline-content">
                        <p className="dashboard-page__timeline-text">
                          {entry.note || 'Asset transferred'}
                        </p>
                        <div className="dashboard-page__timeline-meta">
                          {entry.assetId && (
                            <span>Asset ID: {entry.assetId}</span>
                          )}
                          <span className="text-muted">{formatDate(entry.assignedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
