import { NextResponse } from 'next/server'
import { isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be signed in to review requests.' }, { status: 401 })
    }

    if (!isPartnerUser(user)) {
      return NextResponse.json({ error: 'Only partner accounts can review requests.' }, { status: 403 })
    }

    const { data: requestRow, error: requestError } = await supabase
      .from('adoption_requests')
      .select('id, pet_id, status')
      .eq('id', id)
      .eq('partner_user_id', user.id)
      .maybeSingle()

    if (requestError) {
      return NextResponse.json({ error: requestError.message }, { status: 500 })
    }

    if (!requestRow) {
      return NextResponse.json({ error: 'Adoption request not found.' }, { status: 404 })
    }

    if (requestRow.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending adoption requests can be approved.' },
        { status: 409 }
      )
    }

    const { error: updateError } = await supabase
      .from('adoption_requests')
      .update({
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('partner_user_id', user.id)
      .eq('status', 'pending')

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const { error: rejectOthersError } = await supabase
      .from('adoption_requests')
      .update({
        status: 'rejected',
        review_note: 'Another adopter was approved for this pet.',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('pet_id', requestRow.pet_id)
      .eq('partner_user_id', user.id)
      .eq('status', 'pending')
      .neq('id', id)

    if (rejectOthersError) {
      return NextResponse.json({ error: rejectOthersError.message }, { status: 500 })
    }

    const { error: petStatusError } = await supabase
      .from('pets')
      .update({ status: 'fostered' })
      .eq('id', requestRow.pet_id)
      .eq('partner_user_id', user.id)

    if (petStatusError) {
      return NextResponse.json({ error: petStatusError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Adoption request approved.' })
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : 'Unable to approve adoption request.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
