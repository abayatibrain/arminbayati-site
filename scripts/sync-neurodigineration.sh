#!/usr/bin/env bash
# Sync the latest neurodigineration source into arminbayati-site/neurodigineration/.
#
# Run this whenever the neurodigineration repo updates and you want the
# arminbayati.com/bioscope deployment to reflect the new version.
#
# Usage (from anywhere):
#   bash scripts/sync-neurodigineration.sh
#
# Assumes:
#   - neurodigineration is cloned at ~/Documents/GitHub/neurodigineration
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
DEST="$SITE_DIR/neurodigineration"

# Where to find neurodigineration. Override with ND_SRC env var if it lives elsewhere.
SRC="${ND_SRC:-$HOME/Documents/GitHub/neurodigineration}"

if [ ! -d "$SRC" ]; then
  echo "ERROR: neurodigineration source not found at $SRC"
  echo "       Set ND_SRC=/path/to/neurodigineration if it lives somewhere else."
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
echo "  git status neurodigineration/"
echo "  git add neurodigineration/"
echo "  git commit -m \"sync(neurodigineration): pull latest neurodigineration\""
echo "  git push"
