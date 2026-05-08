import LoadingSpinner from '../common/LoadingSpinner'
import './UserForm.css'

/**
 * UserForm — role update form (Admin only).
 *
 * @param {number}   currentRole — current roleId
 * @param {Function} onSubmit    — called with the new roleId
 * @param {boolean}  loading     — submit in progress
 */
export default function UserForm({ currentRole, onSubmit, loading }) {
  const roles = [
    { id: 0, label: 'Developer' },
    { id: 1, label: 'Manager' },
    { id: 2, label: 'Admin' },
  ]

  function handleChange(e) {
    const newRole = Number(e.target.value)
    if (newRole !== currentRole) {
      onSubmit(newRole)
    }
  }

  return (
    <div className="user-form">
      <label className="form-label" htmlFor="user-role-select">
        Change Role
      </label>
      <div className="user-form__row">
        <select
          id="user-role-select"
          className="form-select"
          value={currentRole}
          onChange={handleChange}
          disabled={loading}
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
        {loading && <LoadingSpinner size="sm" inline />}
      </div>
    </div>
  )
}
