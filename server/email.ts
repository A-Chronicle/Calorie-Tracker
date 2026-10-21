// Sends transactional email through Resend (https://resend.com). Without RESEND_API_KEY in
// development, the message is printed to the server log instead, so local testing needs no account.
export interface EmailMessage {
  to: string
  subject: string
  text: string
}

export async function sendEmail({ to, subject, text }: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY is not set')
    console.log(`[dev email] to=${to} subject="${subject}"\n${text}`)
    return
  }

  const from = process.env.EMAIL_FROM
  if (!from) throw new Error('EMAIL_FROM is not set')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text }),
  })
  if (!response.ok) {
    throw new Error(`Email send failed (${response.status}): ${await response.text()}`)
  }
}
