# Commands

Append-only log of all CLI commands for this project.
See `scripts/run.sh` for the executable version.

Pending commands are uncommented. Executed commands are commented out.

---

## 2026-04-19 — Phase 2 deploy to M920

```bash
# --- Executed ---

# Pulled latest code on M920
# ssh deus@10.0.0.117 "cd ~/huginn && git pull origin master"

# Wiped postgres volume (was initialized with placeholder password)
# ssh deus@10.0.0.117 "cd ~/huginn && docker compose down -v && docker compose up -d"

# Added PUBLIC_URL to .env on M920
# ssh deus@10.0.0.117 "echo 'PUBLIC_URL=https://huginn.huginndigital.com' >> ~/huginn/.env"

# Pulled latest + rebuilt huginn (removed n8n, added Telegram webhook)
# ssh deus@10.0.0.117 "cd ~/huginn && git pull && docker compose up -d --build huginn"

# --- Pending ---

# Remove orphan n8n container
ssh deus@10.0.0.117 "cd ~/huginn && docker compose down --remove-orphans && docker compose up -d"
```
