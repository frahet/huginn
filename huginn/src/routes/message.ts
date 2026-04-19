import { search, formatContext } from '../lib/brain.ts'
import { reply } from '../lib/claude.ts'

export interface MessageBody {
  text: string
  chatId?: string
}

export async function handleMessage(body: MessageBody): Promise<{ reply: string }> {
  const results = await search(body.text)
  const context = formatContext(results)
  const response = await reply(body.text, context)
  return { reply: response }
}
