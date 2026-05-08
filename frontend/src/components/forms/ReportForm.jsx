import './ReportForm.css'

/**
 * ReportForm — reusable form for creating condition reports.
 *
 * @param {Object}   formData  — { assetId, description }
 * @param {Object}   errors    — field-level validation errors
 * @param {Function} onChange  — field change handler
 * @param {Function} onSubmit  — form submit handler
 * @param {boolean}  loading   — submit in progress
 * @param {Array}    assets    — list of assets for dropdown
 */
export default function ReportForm({
  formData,
  errors,
  onChange,
  onSubmit,
  loading,
  assets = [],
}) {
  return (
    <form className="report-form" onSubmit={onSubmit} noValidate>
      {/* Asset Select */}
      <div className="form-group">
        <label className="form-label" htmlFor="report-assetId">
          Asset <span className="report-form__required">*</span>
        </label>
        <select
          id="report-assetId"
          className={`form-select ${errors.assetId ? 'error' : ''}`}
          name="assetId"
          value={formData.assetId}
          onChange={onChange}
        >
          <option value="">Select an asset</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.sn} — {a.brand} {a.model} ({a.type})
            </option>
          ))}
        </select>
        {errors.assetId && <span className="form-error">{errors.assetId}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="report-description">
          Description <span className="report-form__required">*</span>
        </label>
        <textarea
          id="report-description"
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          name="description"
          placeholder="Describe the issue or condition of the asset…"
          value={formData.description}
          onChange={onChange}
          rows={5}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Submit */}
      <div className="report-form__actions">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="report-form__spinner" />
              Submitting…
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </div>
    </form>
  )
}
