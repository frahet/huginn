import { putPage } from '../lib/brain.ts'
import type { PageType } from 'gbrain/types'

const SLUG_RE = /^([a-z]+\/[a-z0-9\-]+)\s+([\s\S]+)$/

function todaySlug(): string {
  return `notes/${new Date().toISOString().slice(0, 10)}`
}

function inferType(slug: string): PageType {
  const prefix = slug.split('/')[0]
  const map: Record<string, PageType> = {
    projects: 'project',
    concepts: 'concept',
    people: 'person',
    companies: 'company',
    notes: 'analysis',
    guides: 'guide',
    architecture: 'architecture',
  }
  return map[prefix] ?? 'concept'
}

function titleFromSlug(slug: string): string {
  return slug.split('/').pop()!.replace(/-/g, ' ')
}

export async function handleSave(args: string): Promise<string> {
  const match = args.match(SLUG_RE)
  let slug: string
  let content: string

  if (match) {
    slug = match[1]
    content = match[2].trim()
  } else {
    slug = todaySlug()
    content = args.trim()
  }

  const type = inferType(slug)
  const title = titleFromSlug(slug)

  await putPage(slug, type, title, content)
  return `Saved to ${slug}`
}
