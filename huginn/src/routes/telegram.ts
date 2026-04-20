import { search, formatContext } from '../lib/brain.ts'
import { reply } from '../lib/claude.ts'
import { sendMessage } from '../lib/telegram.ts'
import { handleSave } from '../commands/save.ts'
import { handleBrief } from '../commands/brief.ts'

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

  if (text.startsWith('/save ')) {
    const result = await handleSave(text.slice(6))
    await sendMessage(chatId, result)
    return
  }

  if (text === '/brief') {
    await sendMessage(chatId, 'Checking email and memory...')
    const result = await handleBrief()
    await sendMessage(chatId, result)
    return
  }

  const results = await search(text)
  const context = formatContext(results)
  const response = await reply(text, context)
  await sendMessage(chatId, response)
}
