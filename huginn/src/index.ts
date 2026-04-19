import { handleMessage } from './routes/message.ts'
import { handleTelegramUpdate } from './routes/telegram.ts'
import { setWebhook } from './lib/telegram.ts'

const PORT = 3000
const WEBHOOK_URL = `${process.env.PUBLIC_URL}/telegram`

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)

    if (req.method === 'GET' && url.pathname === '/health') {
      return Response.json({ status: 'ok' })
    }

    if (req.method === 'POST' && url.pathname === '/telegram') {
      const update = await req.json()
      handleTelegramUpdate(update).catch(console.error)
      return new Response('ok')
    }

    if (req.method === 'POST' && url.pathname === '/message') {
      const body = await req.json()
      if (!body?.text) {
        return Response.json({ error: 'text is required' }, { status: 400 })
      }
      const result = await handleMessage(body)
      return Response.json(result)
    }

    return Response.json({ error: 'not found' }, { status: 404 })
  },
  error(err) {
    console.error(err)
    return Response.json({ error: 'internal server error' }, { status: 500 })
  },
})

console.log(`Huginn listening on :${PORT}`)

setWebhook(WEBHOOK_URL)
  .then(() => console.log(`Telegram webhook registered: ${WEBHOOK_URL}`))
  .catch(console.error)
