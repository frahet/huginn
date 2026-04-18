# Huginn

A self-hosted AI operating system. Runs 24/7 on a Linux machine — monitoring projects, digesting news, running agents, and communicating via Telegram.

## Two ravens

- **Muninn** (Memory) — PostgreSQL + pgvector. Stores everything, searches by meaning. MCP server for Claude Code.
- **Huginn** (Thought) — Agent layer + HTTP API + cron scheduler. n8n routes Telegram → Huginn → Telegram.

## Setup

```bash
git clone https://github.com/your-username/huginn
cd huginn
git submodule update --init
```

Then:

```bash
cp .env.example .env
# Fill in secrets in .env
docker compose up -d
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full picture.

## Stack

| Layer | Tech |
|-------|------|
| Communication hub | n8n (Telegram webhooks) |
| Agent API | Bun + TypeScript, port 3000 |
| Memory | Muninn (GBrain fork), PostgreSQL + pgvector, port 7422 |
| Reasoning | Claude API (Sonnet) |
| Embeddings | OpenAI text-embedding-3-large |
| Interface | Telegram |
| Containers | Docker Compose |
| Host | Linux (always-on, SSH) |

## Message flow

```
Telegram → n8n webhook → POST huginn:3000/message → Claude + Muninn → n8n → Telegram
```

## License

MIT
