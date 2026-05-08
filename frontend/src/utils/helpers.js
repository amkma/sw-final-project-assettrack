import { ROLE_LABELS } from './constants'

/**
 * Format a date string to a readable format.
 * @param {string} dateStr — ISO date string
 * @param {Object} opts    — Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '—'
  const defaults = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Intl.DateTimeFormat('en-US', { ...defaults, ...opts }).format(
    new Date(dateStr)
  )
}

/**
 * Get a human-readable role name from a roleId.
 * @param {number} roleId
 * @returns {string}
 */
export function getRoleName(roleId) {
  return ROLE_LABELS[roleId] || 'Unknown'
}

/**
 * Calculate warranty status from a warranty end date.
 * @param {string} dateStr — warranty end date
 * @returns {{ label: string, color: string }}
 */
export function getWarrantyStatus(dateStr) {
  if (!dateStr) return { label: 'Unknown', color: 'neutral' }
  const end = new Date(dateStr)
  const now = new Date()
  const soon = new Date(now)
  soon.setDate(now.getDate() + 30)

  if (end < now) return { label: 'Expired', color: 'danger' }
  if (end <= soon) return { label: 'Expiring Soon', color: 'warning' }
  return { label: 'Valid', color: 'success' }
}

/**
 * Build user initials from first and last name.
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

/**
 * Group an array of items by a date field into date-label buckets.
 * @param {Array}  items     — array of objects
 * @param {string} dateField — key name containing the date
 * @returns {Object} — { 'May 8, 2026': [...], ... }
 */
export function groupByDate(items, dateField = 'date') {
  const groups = {}
  items.forEach((item) => {
    const label = formatDate(item[dateField])
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  })
  return groups
}
