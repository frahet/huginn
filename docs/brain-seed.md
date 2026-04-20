# Brain Seed — Messages to send to @Muninn_digital_bot

Send each block as a separate /save message in Telegram.
Copy-paste one at a time.

---

## Identity

/save people/frank Frank Hetland. Solo developer based in Maricá, Brazil. Mission: financial independence through software. Building Huginn (personal AI OS), Novo Orion (trading), Forge (gym brand), and IT consulting. GitHub: frahet. Email: frankhetland@gmail.com.

---

## Huginn

/save projects/huginn Personal AI operating system running 24/7 on M920 home server. Two ravens: Huginn (agent/thought) + gbrain (memory). Telegram is the primary interface. Stack: Bun + TypeScript + PostgreSQL + pgvector + Claude API (Sonnet). Repo: github.com/frahet/huginn. Public, open source.

/save projects/huginn/architecture Huginn HTTP API on port 3000. gbrain for memory (garrytan/gbrain, PostgreSQL + pgvector). Telegram webhook at huginn.huginndigital.com/telegram. No n8n — Telegram talks directly to Huginn. Docker Compose on M920 (2 containers: postgres + huginn). Cloudflare tunnel for public access.

/save projects/huginn/commands Available Telegram commands: /save <slug> <content> saves to brain. /forget <slug> deletes from brain. /brief generates morning briefing with Gmail + brain context. Free text = ask Claude with memory context.

/save projects/huginn/stack Bun runtime. TypeScript. gbrain library imported directly (file dependency). Anthropic SDK for Claude. imap + mailparser for Gmail. PostgreSQL 16 + pgvector. Docker Compose. Cloudflare tunnel (ex-machina). Domain: huginndigital.com.

/save projects/huginn/next Morning briefing cron job (7am daily auto-send). OpenAI key for vector search. Novo Orion monitor job. /status command. Seed brain with project context.

---

## M920 Home Server

/save infrastructure/m920 Home server: Ex-Machina. Ubuntu 24.04. IP 10.0.0.117. SSH as deus. Docker 29.4. Running Huginn stack 24/7. Cloudflare tunnel (cloudflared v2026.3.0) exposes huginn.huginndigital.com and ssh.huginndigital.com.

/save infrastructure/cloudflare Cloudflare account: frankhetland@gmail.com. Zone: huginndigital.com. Tunnel: ex-machina (ID 1a60d1de-3ff3-4af0-8be6-fd3af5c31f18). Routes: huginn.huginndigital.com → localhost:3000, ssh.huginndigital.com → localhost:22. Telegram webhook IPs whitelisted in Cloudflare firewall.

---

## Novo Orion

/save projects/novo-orion Trading bot on Binance. Automated crypto trading strategy. Stack: Kafka (Upstash managed) + Redis + Binance API + Cloudflare + Vercel. GitHub orgs: Novo-Orion (novo-token, novo-pulse). Domain: novoorion.com (live) and novoorion.ai. Landing page live at novoorion.com.

/save projects/novo-orion/architecture Kafka for event streaming (replay capability — why Kafka over RabbitMQ). Redis for state. Binance API for trades. Cloudflare for edge. Vercel for frontend. Upstash as managed Kafka provider.

---

## Forge

/save projects/forge Forge by Ferro & Hetland. Gym brand in Maricá, Brazil. Opening Q3 2026. Partnership between Frank Hetland and Ferro. Location: Av. Jardel Filho Quadra 386 Lote 4, Maricá. Membership tiers: R$149 / R$249 / R$449 (placeholder). Waitlist not yet wired to backend. Domain: huginndigital.com (Forge page at novoorion.com/forge).

---

## Huginn Digital

/save projects/huginn-digital IT consulting brand. Website: huginndigital.com. All pages live. Contact form wired. Open issues: analytics (#17), SEO (#15), .no domain redirect (#16), LinkedIn (#20). Email: hello@huginndigital.com (to be set up). Domain also on Cloudflare.

---

## Domains & Infrastructure

/save infrastructure/domains All domains on Cloudflare DNS (goal). novoorion.com: GoDaddy registrar, Cloudflare DNS, live. novoorion.ai: GoDaddy registrar, GoDaddy DNS (migrate to Cloudflare). huginndigital.com: GoDaddy registrar, Cloudflare DNS, live. huginndigital.no: GoDaddy registrar, Cloudflare DNS, live.

/save infrastructure/accounts AWS account: 767398085554, preferred region eu-west-1 (Ireland). Supabase: one account, one project per product. GitHub: frahet (personal), Novo-Orion org. Vercel: frontend hosting for Next.js projects.

---

## Tech Decisions

/save decisions/no-n8n Decided to remove n8n from the Huginn stack. n8n added complexity without value for a solo developer who prefers code. Telegram now talks directly to Huginn via webhook. n8n can be added back later if multi-channel routing becomes needed.

/save decisions/gbrain-not-forked Using garrytan/gbrain directly as a git submodule, not forking it. Reason: project is early, lots being built, renaming/forking adds friction. Stay close to upstream until things stabilize. gbrain is the memory layer (Muninn concept).

/save decisions/telegram-direct Telegram webhook registered directly on Huginn (https://huginn.huginndigital.com/telegram). Cloudflare bot protection bypassed by whitelisting Telegram IP ranges (149.154.160.0/20 and 91.108.4.0/22) via IP Access Rules.

/save decisions/bun-typescript Huginn agent built with Bun + TypeScript. Bun chosen for native TypeScript support, fast startup, built-in HTTP server. No framework needed for the minimal HTTP API.

---

## Stack Defaults (Global)

/save concepts/stack-defaults Next.js App Router + TypeScript + Tailwind v4 for frontend. Vercel for hosting. AWS for backend/infra (Lambda, S3, RDS). Python for backend services (FastAPI, boto3). pnpm as package manager. shadcn/ui for components. Clerk for auth. Resend for email.
