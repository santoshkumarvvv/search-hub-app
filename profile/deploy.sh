#!/usr/bin/env bash
# ==============================================================================
# 🚀 DARK RESEARCHER (Blood-Red Edition) — Automated One-Command Deployer
# ==============================================================================
# This script automatically clones your GitHub profile repo
# (santoshkumarvvv/santoshkumarvvv), copies the upgraded README.md and all
# automated GitHub Actions workflows, commits, and pushes straight to main.
#
# Usage:
#   bash profile/deploy.sh
# ==============================================================================

set -e

REPO_URL="https://github.com/santoshkumarvvv/santoshkumarvvv.git"
TEMP_DIR="/tmp/santosh-profile-deploy-$(date +%s)"

echo "🔴 [1/4] Cloning $REPO_URL to temporary workspace..."
git clone "$REPO_URL" "$TEMP_DIR"

echo "🔴 [2/4] Syncing DARK RESEARCHER README.md & automated workflows..."
mkdir -p "$TEMP_DIR/.github/workflows"

# Copy upgraded profile files
cp -f profile/README.md "$TEMP_DIR/README.md"
cp -f profile/.github/workflows/snake.yml "$TEMP_DIR/.github/workflows/snake.yml"
cp -f profile/.github/workflows/metrics.yml "$TEMP_DIR/.github/workflows/metrics.yml"
cp -f profile/.github/workflows/profile-summary.yml "$TEMP_DIR/.github/workflows/profile-summary.yml"

echo "🔴 [3/4] Committing updated profile and workflows..."
cd "$TEMP_DIR"
git add README.md .github/workflows/snake.yml .github/workflows/metrics.yml .github/workflows/profile-summary.yml
git commit -m "🔥 Deploy DARK RESEARCHER (Blood-Red Edition): Avatar Card, Activity Graphs, Projects & Automated Workflows" || echo "No changes to commit."

echo "🔴 [4/4] Pushing straight to main..."
git push origin main

echo "✅ Deployment complete! Your DARK RESEARCHER GitHub profile is LIVE!"
rm -rf "$TEMP_DIR"
