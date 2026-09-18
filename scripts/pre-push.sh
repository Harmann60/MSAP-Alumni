#!/usr/bin/env sh
# =============================================================================
# pre-push Git hook — Secret Leakage Scanner
# =============================================================================
# This hook runs automatically before every `git push` and aborts the push
# if it detects any suspicious secrets or credential patterns in staged
# or recently-committed files.
#
# Installation (run once):
#   cp scripts/pre-push.sh .git/hooks/pre-push
#   chmod +x .git/hooks/pre-push
#
# Or use a tool like `husky` to manage hooks automatically.
# =============================================================================

set -e

echo "🔒 Running secret scan before push..."

# ─── Patterns to detect ──────────────────────────────────────────────────────
PATTERNS=(
  # Raw API / service keys
  "SUPABASE_SERVICE_ROLE_KEY=[a-zA-Z0-9_\-\.]{20,}"
  "SUPABASE_ANON_KEY=[a-zA-Z0-9_\-\.]{20,}"
  # JWT secrets that look real (not the placeholder)
  "JWT_SECRET=[a-zA-Z0-9_\-\.]{32,}"
  # SMTP credentials — actual passwords (not placeholder text)
  "SMTP_PASS=[a-zA-Z0-9_\-\.]{10,}"
  # Private keys
  "-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"
  # Generic patterns
  "password\s*=\s*['\"][^'\"]{8,}['\"]"
  "secret\s*=\s*['\"][^'\"]{8,}['\"]"
  "api_key\s*=\s*['\"][^'\"]{8,}['\"]"
  "apikey\s*=\s*['\"][^'\"]{8,}['\"]"
)

# ─── Files to scan (changed files in this push) ─────────────────────────────
FILES_CHANGED=$(git diff --name-only HEAD @{u} 2>/dev/null || git diff --name-only HEAD~1 HEAD 2>/dev/null || true)

if [ -z "$FILES_CHANGED" ]; then
  echo "  ✅ No changed files to scan."
  exit 0
fi

FOUND_SECRETS=0

for PATTERN in "${PATTERNS[@]}"; do
  MATCHES=$(echo "$FILES_CHANGED" | xargs grep -rlE "$PATTERN" 2>/dev/null || true)
  if [ -n "$MATCHES" ]; then
    echo ""
    echo "  ❌ POTENTIAL SECRET DETECTED matching pattern: $PATTERN"
    echo "  In file(s):"
    echo "$MATCHES" | sed 's/^/    → /'
    FOUND_SECRETS=1
  fi
done

# ─── Block push if secrets found ────────────────────────────────────────────
if [ "$FOUND_SECRETS" -eq 1 ]; then
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  🚨 PUSH ABORTED: Possible secrets detected in your diff."
  echo "  Review the files above, remove any real credentials,"
  echo "  and make sure all secrets live only in .env (which is"
  echo "  already in .gitignore and must never be committed)."
  echo "════════════════════════════════════════════════════════════"
  exit 1
fi

echo "  ✅ No secrets detected. Push allowed."
exit 0
