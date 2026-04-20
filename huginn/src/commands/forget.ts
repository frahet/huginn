import { getEngine } from '../lib/brain.ts'

export async function handleForget(slug: string): Promise<string> {
  slug = slug.trim()
  if (!slug) return 'Usage: /forget <slug> — e.g. /forget projects/huginn'

  const engine = await getEngine()
  const page = await engine.getPage(slug)
  if (!page) return `Nothing found at ${slug}`

  await engine.deletePage(slug)
  return `Deleted ${slug}`
}
