#!/usr/bin/env bash
# Pull latest CV from Overleaf, compile main.tex, and copy the PDF into public/.
# Exits 0 on success (whether or not anything changed). Non-zero on failure.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OVERLEAF_DIR="$(cd "$SITE_DIR/../overleaf_resumeCV" && pwd)"
PUBLIC_PDF="$SITE_DIR/public/Alexandra Neagu Resume.pdf"
DEPS_FILE="$SCRIPT_DIR/.cv-deps"
BUILD_DIR="$(mktemp -d -t cv-build-XXXXXX)"

trap 'rm -rf "$BUILD_DIR"' EXIT

log() { printf '[update-cv] %s\n' "$*"; }

if ! command -v latexmk >/dev/null 2>&1; then
  echo "[update-cv] ERROR: latexmk not found in PATH" >&2
  exit 1
fi

FORCE=0
if [ "${1:-}" = "--force" ] || [ "${1:-}" = "-f" ]; then
  FORCE=1
fi

log "Pulling Overleaf project..."
cd "$OVERLEAF_DIR"
PRE_HEAD="$(git rev-parse HEAD)"
git pull --ff-only --quiet
POST_HEAD="$(git rev-parse HEAD)"

# Detect uncommitted local edits to tracked files (these wouldn't show up in git pull).
LOCAL_DIRTY="$(git status --porcelain -- ':!:.cv-deps' 2>/dev/null || true)"

if [ "$FORCE" -eq 1 ]; then
  log "Force flag set; recompiling."
elif [ -f "$PUBLIC_PDF" ] && [ -f "$DEPS_FILE" ]; then
  if [ "$PRE_HEAD" = "$POST_HEAD" ] && [ -z "$LOCAL_DIRTY" ]; then
    log "No upstream changes and no local edits; existing PDF kept."
    exit 0
  fi
  if [ -n "$LOCAL_DIRTY" ]; then
    log "Local edits detected; recompiling."
  else
    CHANGED_FILES="$(git diff --name-only "$PRE_HEAD" "$POST_HEAD")"
    if [ -z "$CHANGED_FILES" ]; then
      log "No file diffs between $PRE_HEAD and $POST_HEAD; existing PDF kept."
      exit 0
    fi
    # Recompile only if a file used by main.tex changed.
    if ! grep -Fxq -f "$DEPS_FILE" <(printf '%s\n' "$CHANGED_FILES"); then
      log "Upstream changes don't touch main.tex dependencies; existing PDF kept."
      log "Changed: $(printf '%s ' $CHANGED_FILES)"
      exit 0
    fi
    log "main.tex dependencies changed; recompiling."
  fi
fi

log "Compiling main.tex (output: $BUILD_DIR)..."
latexmk -pdf -interaction=nonstopmode -halt-on-error \
  -outdir="$BUILD_DIR" main.tex >"$BUILD_DIR/latexmk.log" 2>&1 || {
    echo "[update-cv] ERROR: latexmk failed. Tail of log:" >&2
    tail -n 40 "$BUILD_DIR/latexmk.log" >&2
    exit 1
  }

if [ ! -f "$BUILD_DIR/main.pdf" ]; then
  echo "[update-cv] ERROR: main.pdf was not produced" >&2
  exit 1
fi

cp "$BUILD_DIR/main.pdf" "$PUBLIC_PDF"

# Capture the list of repo-relative source files latexmk actually pulled in,
# so the next run can decide whether to recompile based on real dependencies.
if [ -f "$BUILD_DIR/main.fls" ]; then
  awk '/^INPUT / {
    sub(/^INPUT /, "")
    sub(/^\.\//, "")
    # keep only repo-relative paths (skip absolute system paths)
    if ($0 !~ /^\//) print
  }' "$BUILD_DIR/main.fls" \
    | grep -Ev '\.(aux|fls|log|out|fdb_latexmk|toc|bbl|blg|synctex\.gz|pdf)$' \
    | sort -u > "$DEPS_FILE"
  log "Wrote $(wc -l < "$DEPS_FILE" | tr -d ' ') dependency paths to $DEPS_FILE"
fi

log "Updated $PUBLIC_PDF (Overleaf $PRE_HEAD -> $POST_HEAD)"
