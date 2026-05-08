import './AssetForm.css'

/**
 * AssetForm — reusable form for creating/editing assets.
 *
 * @param {Object}   formData   — current form state
 * @param {Object}   errors     — field-level validation errors
 * @param {Function} onChange   — field change handler
 * @param {Function} onSubmit   — form submit handler
 * @param {boolean}  loading    — submit in progress
 * @param {boolean}  isEditing  — true if editing an existing asset
 * @param {Array}    users      — list of users for "Assign To" dropdown
 */
export default function AssetForm({
  formData,
  errors,
  onChange,
  onSubmit,
  loading,
  isEditing = false,
  users = [],
}) {
  const assetTypes = ['Laptop', 'Monitor', 'Accessory']

  return (
    <form className="asset-form" onSubmit={onSubmit} noValidate>
      <div className="asset-form__grid">
        {/* Serial Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="asset-sn">
            Serial Number <span className="asset-form__required">*</span>
          </label>
          <input
            id="asset-sn"
            className={`form-input ${errors.sn ? 'error' : ''}`}
            type="text"
            name="sn"
            placeholder="e.g. SN-20240001"
            value={formData.sn}
            onChange={onChange}
            autoFocus
          />
          {errors.sn && <span className="form-error">{errors.sn}</span>}
        </div>

        {/* Type */}
        <div className="form-group">
          <label className="form-label" htmlFor="asset-type">
            Type <span className="asset-form__required">*</span>
          </label>
          <select
            id="asset-type"
            className={`form-select ${errors.type ? 'error' : ''}`}
            name="type"
            value={formData.type}
            onChange={onChange}
          >
            <option value="">Select type</option>
            {assetTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.type && <span className="form-error">{errors.type}</span>}
        </div>

        {/* Brand */}
        <div className="form-group">
          <label className="form-label" htmlFor="asset-brand">
            Brand <span className="asset-form__required">*</span>
          </label>
          <input
            id="asset-brand"
            className={`form-input ${errors.brand ? 'error' : ''}`}
            type="text"
            name="brand"
            placeholder="e.g. Dell, HP, Apple"
            value={formData.brand}
            onChange={onChange}
          />
          {errors.brand && <span className="form-error">{errors.brand}</span>}
        </div>

        {/* Model */}
        <div className="form-group">
          <label className="form-label" htmlFor="asset-model">
            Model <span className="asset-form__required">*</span>
          </label>
          <input
            id="asset-model"
            className={`form-input ${errors.model ? 'error' : ''}`}
            type="text"
            name="model"
            placeholder="e.g. Latitude 5540"
            value={formData.model}
            onChange={onChange}
          />
          {errors.model && <span className="form-error">{errors.model}</span>}
        </div>

        {/* Purchase Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="asset-purchaseDate">
            Purchase Date
          </label>
          <input
            id="asset-purchaseDate"
            className={`form-input ${errors.purchaseDate ? 'error' : ''}`}
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={onChange}
          />
          {errors.purchaseDate && <span className="form-error">{errors.purchaseDate}</span>}
        </div>

        {/* Warranty End Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="asset-warrantyEndDate">
            Warranty End Date
          </label>
          <input
            id="asset-warrantyEndDate"
            className={`form-input ${errors.warrantyEndDate ? 'error' : ''}`}
            type="date"
            name="warrantyEndDate"
            value={formData.warrantyEndDate}
            onChange={onChange}
          />
          {errors.warrantyEndDate && <span className="form-error">{errors.warrantyEndDate}</span>}
        </div>
      </div>

      {/* Assign To User — full width */}
      <div className="form-group">
        <label className="form-label" htmlFor="asset-userId">
          Assign To User
        </label>
        <select
          id="asset-userId"
          className="form-select"
          name="userId"
          value={formData.userId}
          onChange={onChange}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <div className="asset-form__actions">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="asset-form__spinner" />
              {isEditing ? 'Saving…' : 'Creating…'}
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Create Asset'
          )}
        </button>
      </div>
    </form>
  )
}
