import { fetchUnread } from '../lib/gmail.ts'
import { reply } from '../lib/claude.ts'
import { search, formatContext } from '../lib/brain.ts'

export async function handleBrief(): Promise<string> {
  const [emails, brainResults] = await Promise.all([
    fetchUnread(20).catch(() => []),
    search('current priorities projects status', 5),
  ])

  const context = formatContext(brainResults)

  const emailSection = emails.length
    ? emails.map(e => `From: ${e.from}\nSubject: ${e.subject}\nDate: ${e.date}\n${e.snippet}`).join('\n---\n')
    : 'No unread emails.'

  const prompt = `Generate a concise morning briefing.

Brain context:
${context || 'Nothing in memory yet.'}

Unread emails (${emails.length}):
${emailSection}

Format:
- 2-3 lines on what matters today based on brain context
- Email summary: list each email in one line (sender, subject, one-word action if obvious)
- Keep total under 20 lines`

  return reply(prompt, '')
}
