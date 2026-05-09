import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../api/userApi'
import { getAssets } from '../../api/assetApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import './UsersListPage.css'

const ROLE_MAP = { 0: 'Developer', 1: 'Manager', 2: 'Admin' }
const ROLE_BADGE = { 0: 'badge-neutral', 1: 'badge-info', 2: 'badge-primary' }

export default function UsersListPage() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, assetsRes] = await Promise.allSettled([
          getUsers(),
          getAssets(),
        ])
        if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || [])
        if (assetsRes.status === 'fulfilled') setAssets(assetsRes.value.data || [])
      } catch {
        // API not ready
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Asset counting is no longer supported with the current backend AssetResponse
  // without making individual calls per user. We'll default to '—'.
  const assetCountMap = {}

  // Filter
  const filtered = useMemo(() => {
    if (!filterRole) return users
    return users.filter((u) => u.roleId === Number(filterRole))
  }, [users, filterRole])

  return (
    <div className="users-list-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="users-list-page__filters card">
        <div className="users-list-page__filter-group">
          <label className="form-label" htmlFor="filter-role">Role</label>
          <select
            id="filter-role"
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="0">Developer</option>
            <option value="1">Manager</option>
            <option value="2">Admin</option>
          </select>
        </div>
        {filterRole && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilterRole('')}>
            Clear filter
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <LoadingSpinner message="Loading users…" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>{filterRole ? 'Try changing the role filter.' : 'No users registered yet.'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="users-list-page__row"
                  onClick={() => navigate(`/users/${u.id}`)}
                >
                  <td>
                    <div className="users-list-page__name-cell">
                      <div className="avatar avatar-sm">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <span className="font-medium">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted">{u.email || '—'}</td>
                  <td>
                    <span className={`badge ${ROLE_BADGE[u.roleId] || 'badge-neutral'}`}>
                      {ROLE_MAP[u.roleId] || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
