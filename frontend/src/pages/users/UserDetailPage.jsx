import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getUserById, updateUser, deleteUser, changeRole } from '../../api/userApi'
import { getAssetsByUser } from '../../api/assetApi'
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
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, assetsRes] = await Promise.allSettled([
          getUserById(id),
          getAssetsByUser(id),
        ])
        if (userRes.status === 'fulfilled') setProfile(userRes.value.data)
        if (assetsRes.status === 'fulfilled') {
          const all = assetsRes.value.data?.content || assetsRes.value.data || []
          setUserAssets(all)
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
      const res = await changeRole(id, newRoleId)
      setProfile(res.data)
      setRoleSuccess(`Role updated to ${ROLE_MAP[newRoleId]}`)
      setTimeout(() => setRoleSuccess(''), 3000)
    } catch {
      // handle error silently
    } finally {
      setRoleLoading(false)
    }
  }

  async function handleDeleteUser() {
    if (!window.confirm(`Are you sure you want to delete ${profile.firstName} ${profile.lastName}? All assigned assets will be unassigned.`)) {
      return
    }
    setDeleteLoading(true)
    try {
      await deleteUser(id)
      navigate('/users', { replace: true })
    } catch (err) {
      alert('Failed to delete user.')
    } finally {
      setDeleteLoading(false)
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
          <p className="page-subtitle">{profile.email || 'No email provided'}</p>
        </div>
        {isAdmin && (
          <button 
            className="btn btn-danger" 
            onClick={handleDeleteUser}
            disabled={deleteLoading}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
              <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
            {deleteLoading ? 'Deleting...' : 'Delete User'}
          </button>
        )}
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
              <p className="text-muted text-sm" style={{ margin: 0 }}>{profile.email || 'No email provided'}</p>
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
