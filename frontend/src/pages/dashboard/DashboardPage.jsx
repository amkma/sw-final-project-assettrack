import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { getAssets } from '../../api/assetApi'
import { getHistoryByUser } from '../../api/historyApi'
import StatCard from '../../components/cards/StatCard'
import AssetChart from '../../components/charts/AssetChart'
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
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [assets, setAssets] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [assetsRes] = await Promise.allSettled([
          getAssets(),
        ])

        const assetList =
          assetsRes.status === 'fulfilled' ? assetsRes.value.data : []
        setAssets(assetList)

        // Try to fetch recent history for the current user
        if (user?.id) {
          try {
            const histRes = await getHistoryByUser(user.id)
            setRecentActivity(histRes.data?.slice(0, 5) || [])
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

  const totalAssets = assets.length
  const assignedAssets = assets.filter((a) => a.user != null).length
  const availableAssets = totalAssets - assignedAssets

  const today = new Date()
  const thirtyDaysLater = new Date(today)
  thirtyDaysLater.setDate(today.getDate() + 30)

  const expiringSoon = assets.filter((a) => {
    if (!a.warrantyEndDate) return false
    const end = new Date(a.warrantyEndDate)
    return end >= today && end <= thirtyDaysLater
  }).length

  // ── Chart data ──────────────────────────────────────────

  const typeCounts = {}
  assets.forEach((a) => {
    const t = a.type || 'Other'
    typeCounts[t] = (typeCounts[t] || 0) + 1
  })

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
        <div className="dashboard-page__loading">
          <div className="dashboard-page__spinner" />
          <p>Loading dashboard data…</p>
        </div>
      ) : (
        <>
          {/* Stat Cards Row */}
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
            <StatCard
              title="Expiring Soon"
              value={expiringSoon}
              icon={icons.expiring}
              color="warning"
            />
          </div>

          {/* Charts Row */}
          <div className="dashboard-page__charts">
            <AssetChart
              type="doughnut"
              title="Assets by Type"
              labels={typeLabels.length ? typeLabels : ['No data']}
              values={typeValues.length ? typeValues : [1]}
              colors={typeLabels.length ? typeColors : ['#e9ecef']}
            />
            <AssetChart
              type="bar"
              title="Allocation Status"
              labels={allocationLabels}
              values={allocationValues}
              colors={allocationColors}
            />
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
                          {entry.fromUser && (
                            <span>
                              From: {entry.fromUser.firstName} {entry.fromUser.lastName}
                            </span>
                          )}
                          {entry.toUser && (
                            <span>
                              To: {entry.toUser.firstName} {entry.toUser.lastName}
                            </span>
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
