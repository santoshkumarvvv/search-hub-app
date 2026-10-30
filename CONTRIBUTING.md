# Contributing

Thanks for wanting to help. A few ground rules so we stay fast and safe:

## Before you start

- Read `docs/architecture.md` — understand the layer boundaries before touching code
- Check open issues first; comment on one before working on it
- One concern per pull request

## Workflow

1. Fork or branch from `main`
2. Run `npm install` and `npm run dev` — confirm the site loads
3. Make your change
4. Run `npm run lint` and `npm run build` locally
5. Open a PR using the template

## What we won't merge

- Third-party UI libraries that render in the browser
- Anything that puts API keys in client-side code
- Changes that break the "grid is never empty" rule
- Unrelated formatting-only PRs mixed with logic changes

## Code style

- TypeScript strict, no `any`
- Server components by default; `