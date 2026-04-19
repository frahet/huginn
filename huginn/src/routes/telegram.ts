import { search, formatContext } from '../lib/brain.ts'
import { reply } from '../lib/claude.ts'
import { sendMessage } from '../lib/telegram.ts'

interface TelegramUpdate {
  update_id: number
  message?: {
    text?: string
    chat: { id: number }
  }
}

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  const text = update.message?.text
  const chatId = update.message?.chat.id
  if (!text || !chatId) return

  const results = await search(text)
  const context = formatContext(results)
  const response = await reply(text, context)
  await sendMessage(chatId, response)
}
