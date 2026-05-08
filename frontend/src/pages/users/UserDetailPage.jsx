import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getUserById, updateUser } from '../../api/userApi'
import { getAssets } from '../../api/assetApi'
import UserForm from '../../components/forms/UserForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './UserDetailPage.css'

const ROLE_MAP = { 0: 'Developer', 1: 'Manager', 2: 'Admin' }
const ROLE_BADGE = { 0: 'badge-neutral', 1: 'badge-info', 2: 'badge-primary' }

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.roleId === 2

  const [profile, setProfile] = useState(null)
  const [userAssets, setUserAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleLoading, setRoleLoading] = useState(false)
  const [roleSuccess, setRoleSuccess] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, assetsRes] = await Promise.allSettled([
          getUserById(id),
          getAssets(),
        ])
        if (userRes.status === 'fulfilled') setProfile(userRes.value.data)
        if (assetsRes.status === 'fulfilled') {
          const all = assetsRes.value.data || []
          setUserAssets(all.filter((a) => a.user?.id === Number(id)))
        }
      } catch {
        // API not ready
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  async function handleRoleChange(newRoleId) {
    setRoleLoading(true)
    setRoleSuccess('')
    try {
      const res = await updateUser(id, { roleId: newRoleId })
      setProfile(res.data)
      setRoleSuccess(`Role updated to ${ROLE_MAP[newRoleId]}`)
      setTimeout(() => setRoleSuccess(''), 3000)
    } catch {
      // handle error silently
    } finally {
      setRoleLoading(false)
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

  // ── Loading / Not Found ────────────────────────────────

  if (loading) {
    return <LoadingSpinner message="Loading user details…" />
  }

  if (!profile) {
    return (
      <div className="empty-state">
        <h3>User not found</h3>
        <p>The user you are looking for does not exist.</p>
        <Link to="/users" className="btn btn-primary mt-4">Back to Users</Link>
      </div>
    )
  }

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()

  return (
    <div className="user-detail animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm mb-2" onClick={() => navigate('/users')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clipRule="evenodd" />
            </svg>
            Back to Users
          </button>
          <h1 className="page-title">{profile.firstName} {profile.lastName}</h1>
          <p className="page-subtitle">{profile.email}</p>
        </div>
      </div>

      <div className="user-detail__grid">
        {/* ── Profile Card ──────────────────────────────── */}
        <div className="card user-detail__profile">
          <div className="user-detail__profile-header">
            <div className="user-detail__avatar">{initials}</div>
            <div>
              <h3 className="user-detail__name">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-muted text-sm" style={{ margin: 0 }}>{profile.email}</p>
              <span className={`badge ${ROLE_BADGE[profile.roleId] || 'badge-neutral'} mt-2`}>
                {ROLE_MAP[profile.roleId] || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Role Management (Admin only) */}
          {isAdmin && (
            <div className="user-detail__role-section">
              <div className="user-detail__role-divider" />
              <h4 className="user-detail__section-title">Role Management</h4>
              <UserForm
                currentRole={profile.roleId ?? 0}
                onSubmit={handleRoleChange}
                loading={roleLoading}
              />
              {roleSuccess && (
                <p className="user-detail__role-success animate-fade-in">{roleSuccess}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Stats Card ────────────────────────────────── */}
        <div className="card user-detail__stats">
          <div className="card-header">
            <h3 className="card-title">Overview</h3>
          </div>
          <div className="card-body">
            <div className="user-detail__stat-row">
              <span className="user-detail__stat-label">Assigned Assets</span>
              <span className="user-detail__stat-value">{userAssets.length}</span>
            </div>
            <div className="user-detail__stat-row">
              <span className="user-detail__stat-label">Role</span>
              <span className="user-detail__stat-value">{ROLE_MAP[profile.roleId] || '—'}</span>
            </div>
            <div className="user-detail__stat-row">
              <span className="user-detail__stat-label">User ID</span>
              <span className="user-detail__stat-value text-muted">#{profile.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Assigned Assets ─────────────────────────────── */}
      <div className="card user-detail__assets">
        <div className="card-header">
          <h3 className="card-title">Assigned Assets</h3>
          <span className="badge badge-neutral">{userAssets.length}</span>
        </div>
        <div className="card-body">
          {userAssets.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8) 0' }}>
              <h3>No assets assigned</h3>
              <p>This user currently has no hardware assets.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Type</th>
                    <th>Brand / Model</th>
                    <th>Warranty End</th>
                  </tr>
                </thead>
                <tbody>
                  {userAssets.map((a) => (
                    <tr
                      key={a.id}
                      className="user-detail__asset-row"
                      onClick={() => navigate(`/assets/${a.id}`)}
                    >
                      <td><code>{a.sn}</code></td>
                      <td><span className="badge badge-neutral">{a.type || '—'}</span></td>
                      <td>{a.brand} {a.model}</td>
                      <td>{formatDate(a.warrantyEndDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
