import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are Huginn — a personal AI assistant with memory.
You have context from the user's brain (their notes, projects, decisions).
Be concise. Specific over generic. No fluff.
If you reference something from memory, be explicit about it.`

export async function reply(message: string, context: string): Promise<string> {
  const userContent = context
    ? `Context from memory:\n${context}\n\n---\n\n${message}`
    : message

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: 'user', content: userContent }],
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type')
  return block.text
}
