#!/usr/bin/env bash
# One-shot production deploy for the Starship Safety judge on an Ubuntu VPS.
#
# It makes the portal + worker start on boot and auto-restart (systemd), and
# puts Caddy in front for automatic HTTPS on your domain. Safe to re-run
# (it preserves an existing WORKER_TOKEN).
#
# Run as root from inside the cloned repo:
#     cd /home/ubuntu/dsummit-2026-judge
#     git pull
#     bash deploy_vps.sh
#
# Override the domain / allowed website origin if they change:
#     DOMAIN=judge.example.com ALLOWED_ORIGINS=https://mysite.com bash deploy_vps.sh
set -euo pipefail

DOMAIN="${DOMAIN:-dsummit-judge.duckdns.org}"
ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-https://data-science-summit-2026.vercel.app}"

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV="$REPO_DIR/.venv"
ENV_FILE="/etc/dsummit-judge.env"
DATA_DIR="/home/ubuntu/portal_data"

echo "==> repo:   $REPO_DIR"
echo "==> domain: $DOMAIN"
echo "==> origin: $ALLOWED_ORIGINS"

# --- Python environment: create the venv and install pinned deps -----------
if [ ! -d "$VENV" ]; then
  echo "==> creating virtualenv ..."
  python3 -m venv "$VENV"
fi
echo "==> installing/updating dependencies from requirements.txt ..."
"$VENV/bin/pip" install -q --upgrade pip
"$VENV/bin/pip" install -q -r "$REPO_DIR/requirements.txt"

# --- stop any leftover foreground/background test processes -----------------
pkill -f "uvicorn portal:app" 2>/dev/null || true
pkill -f "worker.py" 2>/dev/null || true

# --- clean mock/test artifacts so the live leaderboard starts empty ---------
rm -rf "$REPO_DIR/submissions" "$REPO_DIR/results" \
       "$REPO_DIR/portal_data" "$REPO_DIR/leaderboard.csv" 2>/dev/null || true
mkdir -p "$DATA_DIR"

# --- config + secret (reuse token on re-run so nothing breaks) --------------
if [ -f "$ENV_FILE" ] && grep -q '^WORKER_TOKEN=' "$ENV_FILE"; then
  TOKEN="$(grep '^WORKER_TOKEN=' "$ENV_FILE" | cut -d= -f2-)"
  echo "==> reusing existing WORKER_TOKEN"
else
  TOKEN="$(openssl rand -hex 24)"
  echo "==> generated new WORKER_TOKEN"
fi
cat > "$ENV_FILE" <<EOF
WORKER_TOKEN=$TOKEN
ALLOWED_ORIGINS=$ALLOWED_ORIGINS
PORTAL_URL=http://127.0.0.1:8000
PORTAL_DATA=$DATA_DIR
EOF
chmod 600 "$ENV_FILE"

# --- systemd services -------------------------------------------------------
cat > /etc/systemd/system/dsummit-portal.service <<EOF
[Unit]
Description=Starship Safety judging portal (FastAPI)
After=network.target

[Service]
WorkingDirectory=$REPO_DIR
EnvironmentFile=$ENV_FILE
ExecStart=$VENV/bin/uvicorn portal:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/dsummit-worker.service <<EOF
[Unit]
Description=Starship Safety judging worker
After=network.target dsummit-portal.service

[Service]
WorkingDirectory=$REPO_DIR
EnvironmentFile=$ENV_FILE
ExecStart=$VENV/bin/python worker.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now dsummit-portal dsummit-worker
sleep 3
curl -s http://127.0.0.1:8000/health && echo "  <- portal healthy" \
  || echo "  portal not up yet (check: journalctl -u dsummit-portal -n 30)"

# --- firewall (allow SSH FIRST so we never lock ourselves out) --------------
if command -v ufw >/dev/null 2>&1; then
  ufw allow 22/tcp  || true
  ufw allow 80/tcp  || true
  ufw allow 443/tcp || true
  ufw --force enable || true
fi

# --- Caddy: automatic HTTPS -------------------------------------------------
if ! command -v caddy >/dev/null 2>&1; then
  echo "==> installing Caddy ..."
  apt install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg
  # Download the signing key to a FILE first, then dearmor it. Piping the
  # download straight into gpg can silently leave an empty keyring, which
  # causes the NO_PUBKEY error on apt update.
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' -o /tmp/caddy-gpg.key
  gpg --batch --yes --dearmor \
    -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg /tmp/caddy-gpg.key
  chmod 0644 /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    > /etc/apt/sources.list.d/caddy-stable.list
  apt update
  apt install -y caddy
fi

# Public HTTPS -> local portal. /worker/* is blocked from the internet
# (the worker reaches the portal directly on localhost, so it is unaffected).
cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
    @worker path /worker/*
    respond @worker 403
    reverse_proxy 127.0.0.1:8000
}
EOF
systemctl reload caddy || systemctl restart caddy

echo ""
echo "======================================================================"
echo " Deploy complete."
echo "   Public URL:      https://$DOMAIN"
echo "   Give web dev:    https://$DOMAIN   (endpoints documented in API.md)"
echo "   Secret token in: $ENV_FILE   (do NOT share; not needed by the website)"
echo ""
echo " Verify from your laptop browser:  https://$DOMAIN/health"
echo "   -> should show {\"ok\":true} with a padlock (may take ~30s for the cert)"
echo "======================================================================"
