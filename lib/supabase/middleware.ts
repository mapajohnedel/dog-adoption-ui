import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedHome, isAdminUser, isPartnerUser } from '@/lib/auth/roles'
import { getSupabaseConfig } from '@/lib/supabase/config'

function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''

  const redirectResponse = NextResponse.redirect(url)

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}

export async function updateSession(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig()
  const pathname = request.nextUrl.pathname

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        response = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (pathname === '/auth' || pathname === '/admin/login') {
    if (user) {
      return redirectWithCookies(request, response, getAuthenticatedHome(user))
    }

    return response
  }

  if (pathname === '/partner/register') {
    if (user) {
      return redirectWithCookies(request, response, getAuthenticatedHome(user))
    }

    return response
  }

  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return redirectWithCookies(request, response, '/auth')
    }

    if (isAdminUser(user) || isPartnerUser(user)) {
      return redirectWithCookies(request, response, getAuthenticatedHome(user))
    }
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!user) {
      return redirectWithCookies(request, response, '/admin/login')
    }

    if (!isAdminUser(user)) {
      return redirectWithCookies(request, response, '/dashboard')
    }
  }

  if (pathname === '/partner' || pathname.startsWith('/partner/')) {
    if (!user) {
      return redirectWithCookies(request, response, '/auth')
    }

    if (isAdminUser(user)) {
      return redirectWithCookies(request, response, '/admin')
    }

    if (!isPartnerUser(user)) {
      return redirectWithCookies(request, response, '/dashboard')
    }
  }

  return response
}
