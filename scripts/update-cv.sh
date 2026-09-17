#!/usr/bin/env bash
# Pull latest CV from Overleaf, compile main.tex, and copy the PDF into public/
# only if it actually differs from the one already published there.
# Exits 0 on success (whether or not anything changed). Non-zero on failure.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OVERLEAF_DIR="$(cd "$SITE_DIR/../overleaf_resumeCV" && pwd)"
PUBLIC_PDF="$SITE_DIR/public/Alexandra Neagu Resume.pdf"
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

# Readable text of a PDF (empty if poppler isn't installed), used to show what
# changed between the published CV and the freshly built one.
pdf_text() {
  command -v pdftotext >/dev/null 2>&1 || return 0
  pdftotext -layout "$1" - 2>/dev/null
}

# Raw PDF bytes minus the bits pdftex randomises per run (the trailer /ID) and
# the build timestamps, so two builds of unchanged sources compare equal.
# This catches layout-only changes that pdf_text cannot see.
pdf_bytes() {
  LC_ALL=C tr -d '\000' < "$1" \
    | LC_ALL=C sed -E 's@/(CreationDate|ModDate) ?\([^)]*\)@@g; s@/ID ?\[[^]]*\]@@g'
}

log "Pulling Overleaf project..."
cd "$OVERLEAF_DIR"
PRE_HEAD="$(git rev-parse HEAD)"
git pull --ff-only --quiet
POST_HEAD="$(git rev-parse HEAD)"

log "Compiling main.tex (output: $BUILD_DIR)..."
# SOURCE_DATE_EPOCH/FORCE_SOURCE_DATE make pdftex's embedded timestamps
# deterministic, so two builds of unchanged sources compare equal.
SOURCE_DATE_EPOCH=0 FORCE_SOURCE_DATE=1 \
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

if [ "$FORCE" -eq 1 ]; then
  log "Force flag set; publishing the freshly built PDF."
elif [ ! -f "$PUBLIC_PDF" ]; then
  log "No PDF in public/ yet; publishing the freshly built one."
else
  pdf_bytes "$PUBLIC_PDF"               > "$BUILD_DIR/published.bin"
  pdf_bytes "$BUILD_DIR/main.pdf"        > "$BUILD_DIR/built.bin"
  pdf_text  "$PUBLIC_PDF"               > "$BUILD_DIR/published.txt"
  pdf_text  "$BUILD_DIR/main.pdf"        > "$BUILD_DIR/built.txt"

  if cmp -s "$BUILD_DIR/published.bin" "$BUILD_DIR/built.bin"; then
    log "Built CV is identical to $PUBLIC_PDF; nothing to do."
    exit 0
  fi

  if cmp -s "$BUILD_DIR/published.txt" "$BUILD_DIR/built.txt"; then
    log "Text is unchanged but the PDF differs (layout, fonts or metadata); publishing."
  else
    log "Content differs from the published CV:"
    diff -u "$BUILD_DIR/published.txt" "$BUILD_DIR/built.txt" \
      | sed -n '3,40p' | sed 's/^/[update-cv]   /' || true
  fi
fi

cp "$BUILD_DIR/main.pdf" "$PUBLIC_PDF"

if [ "$PRE_HEAD" = "$POST_HEAD" ]; then
  log "Updated $PUBLIC_PDF (Overleaf at $PRE_HEAD)"
else
  log "Updated $PUBLIC_PDF (Overleaf $PRE_HEAD -> $POST_HEAD)"
fi
