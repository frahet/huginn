# Huginn — Claude Code Context

## What this project is

Huginn is Frank Hetland's personal AI operating system. It runs on a Linux
machine 24/7 — monitoring projects, digesting news, running agents, and
communicating via Telegram (and future channels via n8n).

Two systems, two ravens:
- **Muninn** (Memory) — forked from GBrain. PostgreSQL + pgvector. Stores
  everything, searches by meaning. MCP server for Claude Code.
- **Huginn** (Thought) — this repo. Agent layer + HTTP API + cron scheduler.
  n8n routes messages from Telegram → Huginn → Telegram.

## Memory

Always use Muninn. Every session.

```bash
# Read context before starting work
muninn query "huginn current status"
muninn query "novo orion architecture"

# Write back after decisions
muninn timeline-add projects/huginn 2026-04-18 "Decided X because Y"
```

**Start of session:** query Muninn for context. Never ask Frank to re-explain.
**End of session:** write decisions and learnings back to Muninn.

## Owner

Frank Hetland (frahet on GitHub). Maricá, Brazil. Solo developer.
Mission: financial independence through software.

## Active projects (all in Muninn)

- **Novo Orion** — trading bot, Binance, Kafka, Redis, Cloudflare, Vercel
- **Forge by Ferro & Hetland** — gym brand
- **Real estate company**
- **IT consulting**
- **Huginn + Muninn** — this system

## Stack

```
n8n          communication hub — Telegram webhooks, future channels
Huginn       Bun + TypeScript, HTTP API (:3000), cron scheduler
Muninn       GBrain fork, PostgreSQL + pgvector, MCP (:7422)
Claude API   Sonnet for reasoning
OpenAI API   text-embedding-3-large for vector search
Telegram     primary interface (via n8n)
Docker       all services containerised, docker compose up
Linux        always-on host machine (SSH)
```

## Message flow

```
Telegram → n8n webhook → POST huginn:3000/message → Claude + Muninn → n8n → Telegram
```

## Workflow rules

- Query Muninn before starting any work — context is there, use it.
- Keep jobs simple: query Muninn → do work → Claude → write back → Telegram.
- n8n handles channel routing. Huginn handles intelligence. Keep them separate.
- Simple before complex. Cron + scripts before agents.
- One channel working fully beats five channels half-built.

## Key references

- Architecture: ARCHITECTURE.md (read this first)
- Muninn: https://github.com/frahet/muninn (forked from garrytan/gbrain)
- GBrain source: https://github.com/garrytan/gbrain
- n8n docs: https://docs.n8n.io

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, save state, save my work → invoke context-save
- Resume, where was I, pick up where I left off → invoke context-restore
- Code quality, health check → invoke health
