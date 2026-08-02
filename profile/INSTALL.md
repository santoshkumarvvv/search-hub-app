# ⚡ HOW TO LIVE-DEPLOY YOUR DARK RESEARCHER PROFILE (BLOOD RED EDITION)

GitHub's integration permissions (HTTP 403) prevent third-party Apps and integration bots from directly overwriting the root `README.md` and workflows inside another repository (`santoshkumarvvv/santoshkumarvvv`).

Here is the **instant 1-minute command** to push this directly to your main profile from your terminal:

### Option 1: One-Line Terminal Push (Using your local git / gh CLI)

Run this in your terminal:

```bash
# Clone your special profile repo locally
git clone https://github.com/santoshkumarvvv/santoshkumarvvv.git /tmp/my-profile
cd /tmp/my-profile

# Create workflow directory
mkdir -p .github/workflows

# Copy the DARK RESEARCHER README and RED SNAKE workflow
curl -sSL https://raw.githubusercontent.com/santoshkumarvvv/search-hub-app/arena/019fc0f9-search-hub-app/profile/README.md > README.md
curl -sSL https://raw.githubusercontent.com/santoshkumarvvv/search-hub-app/arena/019fc0f9-search-hub-app/profile/.github/workflows/snake.yml > .github/workflows/snake.yml

# Commit and push straight to main
git add README.md .github/workflows/snake.yml
git commit -m "🔥 Deploy DARK RESEARCHER profile & Red Snake workflow"
git push origin main
```

---

### Option 2: Copy-Paste Directly on GitHub Web

1. **README.md:** Open [santoshkumarvvv/santoshkumarvvv README.md](https://github.com/santoshkumarvvv/santoshkumarvvv/edit/main/README.md) and replace its content with the contents of `profile/README.md` from this repo.
2. **Snake Workflow:** Create `.github/workflows/snake.yml` in [santoshkumarvvv/santoshkumarvvv](https://github.com/santoshkumarvvv/santoshkumarvvv) and paste the contents of `profile/.github/workflows/snake.yml`.
3. Click **Commit changes** -> Your **DARK RESEARCHER** profile and **Red Snake** will be live instantly!
