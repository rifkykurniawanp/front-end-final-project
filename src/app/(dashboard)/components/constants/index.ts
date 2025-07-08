export const DASHBOARD_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  INSTRUCTOR: 'instructor',
  SUPPLIER: 'supplier'
} as const;

export const DASHBOARD_LABELS = {
  [DASHBOARD_ROLES.ADMIN]: 'Admin',
  [DASHBOARD_ROLES.USER]: 'My Dashboard',
  [DASHBOARD_ROLES.INSTRUCTOR]: 'Instructor',
  [DASHBOARD_ROLES.SUPPLIER]: 'Supplier'
} as const;

export const CURRENCY_FORMAT = {
  IDR: 'Rp',
  THOUSAND: 'K',
  MILLION: 'M'
} as const;

export const TABLE_ACTIONS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete'
} as const;

export const CHART_COLORS = {
  PRIMARY: 'hsl(var(--primary))',
  SECONDARY: 'hsl(var(--secondary))',
  MUTED: 'hsl(var(--muted))'
} as const;