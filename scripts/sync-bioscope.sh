#!/usr/bin/env bash
# Sync the latest bioscope-web source into arminbayati-site/bioscope/.
#
# Run this whenever the bioscope-web repo updates and you want the
# arminbayati.com/bioscope deployment to reflect the new version.
#
# Usage (from anywhere):
#   bash scripts/sync-bioscope.sh
#
# Assumes:
#   - bioscope-web is cloned at ~/Documents/GitHub/bioscope-web
#   - arminbayati-site is this repo (the script lives in arminbayati-site/scripts/)
#
# Behavior:
#   - rsync mirror with --delete so removed bioscope files are removed here too
#   - excludes repo-config files that don't belong inside a subdirectory
#     (.git/, .github/, .gitignore, .nojekyll) and macOS junk (.DS_Store)
#   - dry-run mode if you pass `--dry-run` as the first arg

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEST="$SITE_DIR/bioscope"

# Where to find bioscope-web. Override with BIOSCOPE_SRC env var if it lives elsewhere.
SRC="${BIOSCOPE_SRC:-$HOME/Documents/GitHub/bioscope-web}"

if [ ! -d "$SRC" ]; then
  echo "ERROR: bioscope-web source not found at $SRC"
  echo "       Set BIOSCOPE_SRC=/path/to/bioscope-web if it lives somewhere else."
  exit 1
fi

DRY_FLAG=""
if [ "${1:-}" = "--dry-run" ]; then
  DRY_FLAG="--dry-run"
  echo "DRY RUN — no files will actually change."
fi

mkdir -p "$DEST"

echo "Mirroring  $SRC/  →  $DEST/  (with --delete)"
echo

rsync -av --delete $DRY_FLAG \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='.gitignore' \
  --exclude='.nojekyll' \
  --exclude='.DS_Store' \
  --exclude='node_modules/' \
  "$SRC/" "$DEST/"

echo
echo "Done. Review the diff in the site repo, then commit + push:"
echo
echo "  cd \"$SITE_DIR\""
echo "  git status bioscope/"
echo "  git add bioscope/"
echo "  git commit -m \"sync(bioscope): pull latest bioscope-web\""
echo "  git push"
