# Roadmap

## ✅ Done

- [x] Server-rendered catalog with query-param deep linking
- [x] Unified search across Jikan (MyAnimeList) + TMDb
- [x] Filters: type, genre, four sort orders
- [x] Infinite scroll with IntersectionObserver pre-fetch
- [x] Sandboxed, click-to-load trailer player
- [x] Installable PWA (cache-first shell, offline fallback)
- [x] Graceful degradation: missing TMDb key → anime only; both down → seed catalogue
- [x] Accessibility: skip link, focus rings, ARIA, reduced-motion
- [x] Security hardening: route guards, XSS checks, response headers, adult filtering
- [x] Vercel + Render deployment configs
- [x] `npm audit`: 0 vulnerabilities

## 🚧 In Progress

- [ ] Close out the 11 open issues
- [ ] Move root-level JPG into `public/`
- [ ] Add unit tests for `lib/catalog` (de-dupe, interleave, sort)

## 📋 Planned

- [ ] User accounts + saved lists (Supabase / Firebase)
- [ ] Dark/light theme toggle
- [ ] i18n (Hindi + English)
- [ ] RSS feed for new titles
- [ ] Rate limiting on API routes

## 💡 Ideas

- GraphQL layer over the providers
- Storybook for Card / Toolbar components
- Playwright end-to-end tests
- Multi-language metadata display
