import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getReports, updateReportStatus } from '../../api/reportApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './ReportsListPage.css'

const STATUS_BADGE = {
  PENDING: 'badge-warning',
  REVIEWED: 'badge-info',
  RESOLVED: 'badge-success',
}

const STATUS_LABEL = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  RESOLVED: 'Resolved',
}

export default function ReportsListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdminOrManager = user?.roleId >= 1

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await getReports()
        setReports(res.data?.content || res.data || [])
      } catch {
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const filtered = useMemo(() => {
    if (!filterStatus) return reports
    return reports.filter((r) => r.status === filterStatus)
  }, [reports, filterStatus])

  async function handleStatusChange(reportId, newStatus) {
    setUpdatingId(reportId)
    try {
      const res = await updateReportStatus(reportId, newStatus)
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? res.data : r))
      )
    } catch {
      // handle silently
    } finally {
      setUpdatingId(null)
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  return (
    <div className="reports-list-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">
            {filtered.length} report{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        {/* New Report button — visible to Users (developers) */}
        {user?.roleId === 0 && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/reports/new')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
            </svg>
            New Report
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="reports-list-page__filters card">
        <div className="reports-list-page__filter-group">
          <label className="form-label" htmlFor="filter-report-status">Status</label>
          <select
            id="filter-report-status"
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        {filterStatus && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilterStatus('')}>
            Clear filter
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <LoadingSpinner message="Loading reports…" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 'var(--space-4)', opacity: 0.35 }}>
            <rect x="8" y="4" width="40" height="48" rx="6" stroke="var(--gray-400)" strokeWidth="2" />
            <path d="M18 18h20M18 26h20M18 34h12" stroke="var(--gray-300)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3>No reports found</h3>
          <p>{filterStatus ? 'Try changing the status filter.' : 'No condition reports have been submitted yet.'}</p>
          {user?.roleId === 0 && (
            <button className="btn btn-primary" onClick={() => navigate('/reports/new')}>
              Submit Your First Report
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                {isAdminOrManager && <th>Submitted By</th>}
                {isAdminOrManager && <th>Asset</th>}
                <th>Status</th>
                <th>Date</th>
                {isAdminOrManager && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className="reports-list-page__desc">
                      {report.description || '—'}
                    </span>
                  </td>
                  {isAdminOrManager && (
                    <td>{report.userName || '—'}</td>
                  )}
                  {isAdminOrManager && (
                    <td><code>{report.assetSn || '—'}</code></td>
                  )}
                  <td>
                    <span className={`badge ${STATUS_BADGE[report.status] || 'badge-neutral'}`}>
                      {STATUS_LABEL[report.status] || report.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="text-muted">{formatDate(report.date)}</td>
                  {isAdminOrManager && (
                    <td>
                      <div className="reports-list-page__status-action">
                        <select
                          className="form-select reports-list-page__status-select"
                          value={report.status || ''}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          disabled={updatingId === report.id}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                        {updatingId === report.id && (
                          <LoadingSpinner size="sm" inline />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
