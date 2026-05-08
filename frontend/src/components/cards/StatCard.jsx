import './StatCard.css'

/**
 * StatCard — reusable dashboard metric card.
 *
 * @param {string}    title — label text (e.g. "Total Assets")
 * @param {number}    value — numeric value to display
 * @param {ReactNode} icon  — SVG icon element
 * @param {string}    color — accent color name: "primary" | "success" | "warning" | "danger" | "info"
 * @param {string}    trend — optional trend text (e.g. "+12% from last month")
 */
export default function StatCard({ title, value, icon, color = 'primary', trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon-wrap">
        {icon}
      </div>
      <div className="stat-card__content">
        <span className="stat-card__value">{value ?? '—'}</span>
        <span className="stat-card__title">{title}</span>
        {trend && <span className="stat-card__trend">{trend}</span>}
      </div>
    </div>
  )
}
