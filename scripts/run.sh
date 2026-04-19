#!/usr/bin/env bash
set -euo pipefail

# Huginn deployment commands
# Executed commands are commented out. Uncomment to re-run.
# Run: bash scripts/run.sh

M920="deus@10.0.0.117"

# ── 2026-04-19 Phase 2 deploy ─────────────────────────────────────────────────

# Pull latest code on M920
# ssh "$M920" "cd ~/huginn && git pull origin master"

# Wipe postgres volume (re-init with correct password)
# ssh "$M920" "cd ~/huginn && docker compose down -v && docker compose up -d"

# Add PUBLIC_URL to .env
# ssh "$M920" "echo 'PUBLIC_URL=https://huginn.huginndigital.com' >> ~/huginn/.env"

# Pull latest + rebuild huginn (removed n8n, added Telegram webhook)
# ssh "$M920" "cd ~/huginn && git pull && docker compose up -d --build huginn"

# Remove orphan n8n container
ssh "$M920" "cd ~/huginn && docker compose down --remove-orphans && docker compose up -d"
