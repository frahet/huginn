import { createEngine } from 'gbrain/engine-factory'
import type { BrainEngine, SearchResult, PageType } from 'gbrain/types'

let engine: BrainEngine | null = null

async function getEngine(): Promise<BrainEngine> {
  if (engine) return engine
  const config = { engine: 'postgres' as const, database_url: process.env.DATABASE_URL }
  engine = await createEngine(config)
  await engine.connect(config)
  await engine.initSchema()
  return engine
}

export async function search(query: string, limit = 5): Promise<SearchResult[]> {
  const e = await getEngine()
  return e.searchKeyword(query, { limit })
}

export async function putPage(slug: string, type: PageType, title: string, content: string): Promise<void> {
  const e = await getEngine()
  await e.putPage(slug, { type, title, compiled_truth: content })
}

export function formatContext(results: SearchResult[]): string {
  if (results.length === 0) return ''
  return results.map(r => `## ${r.title}\n${r.chunk_text}`).join('\n\n')
}
