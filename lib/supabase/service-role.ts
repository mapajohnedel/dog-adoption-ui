import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/supabase/config'

let serviceRoleClient: ReturnType<typeof createClient> | undefined

export function createServiceRoleClient() {
  if (!serviceRoleClient) {
    const { supabaseUrl } = getSupabaseConfig()
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY is required for partner approval workflows. Add it to your server environment variables.'
      )
    }

    serviceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return serviceRoleClient
}
