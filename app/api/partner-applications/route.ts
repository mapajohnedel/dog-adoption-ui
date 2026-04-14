import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/auth/roles'
import { partnerApplicationSchema } from '@/lib/partner/applications'
import { listPartnerApplications, submitPartnerApplication } from '@/lib/partner/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const applications = await listPartnerApplications()
    return NextResponse.json({ applications })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load partner applications.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = partnerApplicationSchema.parse(body)
    const application = await submitPartnerApplication(payload)

    return NextResponse.json(
      {
        application,
        message:
          'Application received. Our team will review your shelter or rescuer details before creating your partner account.',
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to submit your partner application.'
    const status = message.includes('already exists') ? 409 : 400

    return NextResponse.json({ error: message }, { status })
  }
}
