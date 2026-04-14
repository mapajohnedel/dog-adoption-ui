import type { User } from '@supabase/supabase-js'

type AuthUserLike = Pick<User, 'email' | 'app_metadata' | 'user_metadata'>
type SupportedRole = 'admin' | 'partner'

function getConfiguredAdminEmails() {
  return (process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function valueIncludesRole(value: unknown, role: SupportedRole): boolean {
  if (typeof value === 'string') {
    return value.trim().toLowerCase() === role
  }

  if (Array.isArray(value)) {
    return value.some((entry) => valueIncludesRole(entry, role))
  }

  return false
}

export function isAdminUser(user: AuthUserLike | null | undefined) {
  if (!user) {
    return false
  }

  const email = user.email?.trim().toLowerCase()
  const adminEmails = getConfiguredAdminEmails()

  if (email && adminEmails.includes(email)) {
    return true
  }

  return (
    valueIncludesRole(user.app_metadata?.role, 'admin') ||
    valueIncludesRole(user.user_metadata?.role, 'admin') ||
    valueIncludesRole(user.user_metadata?.account_type, 'admin')
  )
}

export function isPartnerUser(user: AuthUserLike | null | undefined) {
  if (!user || isAdminUser(user)) {
    return false
  }

  return (
    valueIncludesRole(user.app_metadata?.role, 'partner') ||
    valueIncludesRole(user.user_metadata?.role, 'partner') ||
    valueIncludesRole(user.user_metadata?.account_type, 'partner')
  )
}

export function getAuthenticatedHome(user: AuthUserLike | null | undefined) {
  if (isAdminUser(user)) {
    return '/admin'
  }

  if (isPartnerUser(user)) {
    return '/partner'
  }

  return '/dashboard'
}
