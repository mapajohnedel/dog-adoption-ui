import 'server-only'

type PartnerApprovalEmailInput = {
  to: string
  contactPersonName: string
  organizationName: string
  email: string
  password: string
}

export async function sendPartnerApprovalEmail({
  to,
  contactPersonName,
  organizationName,
  email,
  password,
}: PartnerApprovalEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.PARTNER_APPROVAL_FROM_EMAIL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is required to email partner credentials.')
  }

  if (!from) {
    throw new Error('PARTNER_APPROVAL_FROM_EMAIL is required to email partner credentials.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Your AmponPH partner access has been approved',
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
          <p>Hi ${contactPersonName},</p>
          <p>Your application for <strong>${organizationName}</strong> has been approved.</p>
          <p>You can now sign in to your partner dashboard using the credentials below:</p>
          <ul>
            <li><strong>Login page:</strong> <a href="${siteUrl}/auth">${siteUrl}/auth</a></li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>For security, please sign in as soon as possible and change your password in a future account update flow.</p>
          <p>Thank you for helping more pets find loving homes.</p>
          <p>AmponPH Team</p>
        </div>
      `,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Failed to send partner approval email: ${errorBody}`)
  }
}
