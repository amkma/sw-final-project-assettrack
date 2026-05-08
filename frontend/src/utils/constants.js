// ── Asset Types ──────────────────────────────────────────────
export const ASSET_TYPES = ['Laptop', 'Monitor', 'Accessory']

// ── User Roles ──────────────────────────────────────────────
export const ROLES = {
  DEVELOPER: 0,
  MANAGER: 1,
  ADMIN: 2,
}

export const ROLE_LABELS = {
  [ROLES.DEVELOPER]: 'Developer',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.ADMIN]: 'Admin',
}

export const ROLE_BADGE_CLASS = {
  [ROLES.DEVELOPER]: 'badge-neutral',
  [ROLES.MANAGER]: 'badge-info',
  [ROLES.ADMIN]: 'badge-primary',
}

// ── Report Statuses ─────────────────────────────────────────
export const REPORT_STATUSES = ['Pending', 'Reviewed', 'Resolved']

export const REPORT_STATUS_BADGE = {
  Pending: 'badge-warning',
  Reviewed: 'badge-info',
  Resolved: 'badge-success',
}

// ── Asset Status ────────────────────────────────────────────
export const ASSET_STATUS = {
  ASSIGNED: 'assigned',
  AVAILABLE: 'available',
}
