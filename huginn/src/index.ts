import { handleMessage } from './routes/message.ts'

const PORT = 3000

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)

    if (req.method === 'GET' && url.pathname === '/health') {
      return Response.json({ status: 'ok' })
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
