# Architecture

MediaHub is a **Next.js 15** App Router application. Server-rendered catalog, client-side browsing state, sandboxed media player.

## Layers

```
app/            # Routes: page.tsx (catalog), title/[uid] (detail), api/* (handlers)
components/     # Browser, Toolbar, Card, Player — UI only, no data logic
lib/            # catalog.ts (aggregation), providers/* (Jikan, TMDb adapters), fallback.ts, types.ts
public/         # icon, manifest, service worker
```

## Dependency Rule

> UI never talks to providers directly. Everything flows through `lib/catalog`.

- `components/` → `lib/catalog` + `lib/types`
- `app/api/*` → `lib/catalog` + `lib/providers`
- `lib/providers/*` → external APIs only
- `lib/catalog` → `lib/providers` + `lib/fallback` + `lib/types`

## Data Flow

1. Browser hits `app/page.tsx` with query params (`?q=&kind=&genre=&sort=`)
2. Page calls `lib/catalog.browse()`
3. Catalog calls both providers in parallel — Jikan and TMDb
4. Results are interleaved, de-duplicated by `uid`, then sorted
5. If both providers fail → `lib/fallback.FALLBACK` seed catalogue
6. Page renders the grid server-side; `Browser.tsx` hydrates for infinite scroll

## Why?

- **Indexable** — every catalog view is in the HTML, shareable via URL
- **Resilient** — one dead upstream never kills the page
- **Provider-agnostic UI** — components never branch on which API a row came from
- **Secure by default** — route guards, allow-lists, sandboxed player, zero client-side secrets
