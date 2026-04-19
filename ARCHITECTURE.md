# Huginn — Architecture

> *Huginn and Muninn fly each day over the spacious earth.  
> I fear for Huginn, that he come not back,  
> yet more anxious am I for Muninn.* — Odin

---

## Vision

A personal AI system that works while you sleep. It knows everything about your
projects, learns from your decisions, monitors your world, and surfaces what
matters — so you wake up smarter and ship faster.

**One sentence:** An always-on personal intelligence hub that connects all your
communication channels to a single AI brain with permanent memory.

**The measure of success:** You wake up knowing more than when you went to bed,
without having done anything.

---

## The Two Ravens

### Muninn — Memory
> *"What happened, what exists, what was decided"*

**Muninn is a fork of [GBrain](https://github.com/garrytan/gbrain)** — Garry
Tan's open source personal knowledge brain. PostgreSQL + pgvector + hybrid
search. Forked, renamed, made ours.

We do not rebuild what someone smarter already built better. We stand on good
shoulders and build higher.

**CLI:**
```bash
muninn query "what did we decide about Kafka?"
muninn put projects/novo-orion < note.md
muninn timeline-add projects/novo-orion 2026-04-18 "Decided X because Y"
muninn serve   # MCP server for Claude Code
muninn stats
```

**Knowledge model:**
```markdown
# Novo Orion — Architecture

Compiled truth. Rewritten when understanding changes.
Kafka + Redis + Binance API + Upstash + Cloudflare + Vercel.

---

- 2026-01-15: Chose Kafka over RabbitMQ for replay capability
- 2026-04-18: Decided on Upstash as managed Kafka
```
Above `---`: compiled truth. Below: append-only timeline.

### Huginn — Thought
> *"What to do about it"*

The agent layer. Reads from Muninn, reasons with Claude, acts, writes back.
Exposes an HTTP API that n8n calls. Runs scheduled jobs via cron.

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                    You                          │
│         Telegram (primary interface)            │
│         Email / WhatsApp (future via n8n)       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                   n8n                           │
│           (Communication hub)                   │
│                                                 │
│  Receives webhooks from all channels            │
│  Routes messages to Huginn API                  │
│  Sends replies back to correct channel          │
│  Visual workflow editor at :5678                │
└──────────────────┬──────────────────────────────┘
                   │ HTTP
                   ▼
┌─────────────────────────────────────────────────┐
│                  Huginn                         │
│              (Agent / Brain)                    │
│                                                 │
│  HTTP API        Cron Scheduler                 │
│  /message        morning-briefing               │
│  /query          novo-orion-monitor             │
│  /learn          news-digest                    │
│  /run            github-watch                   │
│                  weekly-report                  │
└──────────────────┬──────────────────────────────┘
                   │ reads & writes
                   ▼
┌─────────────────────────────────────────────────┐
│                  Muninn                         │
│        (Memory — forked GBrain)                 │
│                                                 │
│  PostgreSQL + pgvector                          │
│  Hybrid search (vector + keyword + RRF)         │
│  MCP server for Claude Code (stdio)             │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│               Your World                        │
│  GitHub · Binance · Vercel · TLDR AI · HN       │
└─────────────────────────────────────────────────┘
```

---

## Message Flow (Telegram → Huginn → Telegram)

```
You type anything in Telegram
          ↓
n8n webhook receives message
          ↓
n8n calls Huginn POST /message { text, channel, user }
          ↓
Huginn passes to Claude:
  - your message
  - relevant Muninn context
  - conversation history
          ↓
Claude decides what to do:
  query Muninn / save to Muninn / run a job / just reply
          ↓
Huginn executes, formats response
          ↓
n8n sends reply back to Telegram
          ↓
You receive answer
```

**Examples:**
```
You:    /brief
Huginn: ☀️ Morning — 3 trades, +2.1%...

You:    what did we decide about kafka?
Huginn: You chose Upstash as managed Kafka because...

You:    save this — client wants real-time dashboard for trading
Huginn: ✅ Saved to Novo Orion ideas. Want me to add it to the roadmap?

You:    yes
Huginn: ✅ Added to roadmap with today's date.
```

---

## Infrastructure

| Layer | Technology | Role |
|---|---|---|
| Host | Linux machine (SSH) | Always-on |
| Containers | Docker Compose | Orchestration |
| Communication hub | n8n | Webhook routing, channel integrations |
| Memory | Muninn (GBrain fork) | PostgreSQL + pgvector |
| Agent | Huginn | Claude reasoning + cron jobs |
| Database | PostgreSQL + pgvector | Storage |
| AI reasoning | Claude API (Sonnet) | Intelligence |
| AI embeddings | OpenAI text-embedding-3-large | Vector search |
| Interface | Telegram Bot | Primary control |
| MCP | `muninn serve` | Claude Code bridge |

---

## Docker Compose

See [`docker-compose.yml`](docker-compose.yml) for the full service definitions.

---

## Repo Structure

> **Status:** Architecture phase. The `huginn/` agent directory and all source files below are the target structure — not yet implemented.

```
huginn/                      ← this repo
  docker-compose.yml
  .env.example
  muninn/                    ← git submodule (your-username/muninn)
  huginn/                    ← agent code (to be built)
    src/
      api/
        index.ts             ← HTTP API server (port 3000)
        routes/
          message.ts         ← POST /message (from n8n)
          query.ts           ← POST /query
          learn.ts           ← POST /learn
          run.ts             ← POST /run
      jobs/
        morning-briefing.ts
        novo-orion-monitor.ts
        news-digest.ts
        github-watch.ts
        weekly-report.ts
      lib/
        muninn.ts            ← wrapper around muninn CLI
        claude.ts            ← Claude API client
      scheduler.ts           ← cron runner
    Dockerfile
    package.json
  ARCHITECTURE.md            ← this file
  CLAUDE.md
  .env.example
```

---

## Huginn Job Pattern

```typescript
// Every job follows this loop
const context = await muninn.query("novo orion current status")
const data = await fetchBinanceStats()

const summary = await claude(`
  Context: ${context}
  Data: ${data}
  Write a 3-line briefing. Specific, no fluff.
`)

await muninn.timelineAdd("projects/novo-orion", today, summary)
await telegram.send(summary)
```

---

## Scheduled Jobs

| Job | When | Output |
|---|---|---|
| `morning-briefing` | Daily 7am | Telegram briefing |
| `novo-orion-monitor` | Every 6h | Muninn + alert if needed |
| `news-digest` | Daily 6am | Muninn |
| `github-watch` | Daily | Muninn |
| `weekly-report` | Sunday 8am | Telegram |

---

## Telegram Setup

```
1. Open Telegram → search @BotFather → /newbot
   Name: Huginn
   Username: huginn_yourname_bot
   → Save the token

2. Search @userinfobot → start it → save your chat ID

3. Add both to .env
```

The chat ID locks the bot to you only. Nobody else can interact with it.

---

## n8n Telegram Workflow

Built visually in the n8n editor at `your-machine:5678`:

```
[Telegram Trigger]
  receives any message from you
        ↓
[HTTP Request]
  POST http://huginn:3000/message
  body: { text, chatId }
        ↓
[Telegram Send]
  sends Huginn's response back to you
```

Adding WhatsApp or email later = add one new trigger node in n8n. No new code in Huginn.

---

## Claude Code Integration

```json
// ~/.claude/mcp.json
{
  "mcpServers": {
    "muninn": {
      "command": "ssh",
      "args": ["your-linux-machine", "muninn serve"]
    }
  }
}
```

Every Claude Code session reads your full brain automatically.

---

## Muninn Fork Plan

1. Fork `github.com/garrytan/gbrain` → `github.com/your-username/muninn`
2. Rename CLI: `gbrain` → `muninn`
3. Rename config: `~/.gbrain/` → `~/.muninn/`
4. Update package.json (name, author, description)
5. Write your own README
6. Add as git submodule in huginn repo

Keep upstream remote for pulling improvements:
```bash
git remote add upstream https://github.com/garrytan/gbrain
git fetch upstream && git merge upstream/master  # when needed
```

---

## Build Phases

### Phase 1 — Muninn Running (Week 1)
*Goal: Claude Code sessions never lose context again*
- [x] Fork GBrain → your-username/muninn, rename CLI
- [x] Docker Compose with postgres + muninn
- [ ] Seed with project context
- [ ] MCP connected to Claude Code
- [ ] Verify Claude reads Muninn on session start

### Phase 2 — Huginn + n8n + Telegram (Week 1-2)
*Goal: talk to your brain from your phone*
- [ ] Huginn HTTP API (POST /message)
- [ ] n8n Telegram workflow
- [ ] Free text + commands both work
- [ ] /ask /learn /status /brief working
- [ ] All four containers running via docker compose up

### Phase 3 — Scheduled Jobs (Week 2-3)
*Goal: something useful happens while you sleep*
- [ ] Morning briefing
- [ ] Novo Orion monitor
- [ ] News digest (TLDR AI + HN)
- [ ] Cron scheduler as systemd service

### Phase 4 — Expand (Month 2)
*Goal: proactive intelligence*
- [ ] GitHub watch
- [ ] Weekly report
- [ ] Add email via n8n (one new node)
- [ ] Cross-project pattern recognition

---

## Design Principles

1. **Don't rebuild what exists.** GBrain is Muninn. n8n handles channels. Stand on good shoulders.
2. **n8n is the postman, Huginn is the brain.** Clean separation.
3. **Memory first.** Huginn is only as smart as Muninn is rich.
4. **Low noise.** Only surface what matters.
5. **Ship it.** One channel (Telegram) fully working beats five channels half-built.
6. **It works while you sleep.** The north star.

---

## Key References

- [GBrain (Muninn source)](https://github.com/garrytan/gbrain)
- [gstack (Claude Code workflow)](https://github.com/garrytan/gstack)
- [n8n](https://n8n.io)
- [Huginn repo](https://github.com/frahet/huginn)
- [Muninn repo](https://github.com/frahet/muninn)

---

*Status: Architecture phase*
*Last updated: April 2026*
