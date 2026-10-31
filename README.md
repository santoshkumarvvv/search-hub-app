<div align="center">
  <img src="./assets/hero-banner.svg" alt="Search Hub Cloud Node — Multi-Region Deployment & Aggregation Engine" width="100%" />
</div>

<br />

<div align="center">
  <a href="https://github.com/santoshkumarvvv/search-hub-app/actions">
    <img src="https://img.shields.io/badge/CLOUD_CLUSTER-VERIFIED-2563EB?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI Status" />
  </a>
  &nbsp;
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/DEPLOYMENT-VERCEL_EDGE_%2B_RENDER-0F172A?style=for-the-badge&logo=vercel&logoColor=38BDF8" alt="Vercel & Render" />
  </a>
  &nbsp;
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/NEXT.JS_15.5-REACT_19-0F172A?style=for-the-badge&logo=next.js&logoColor=38BDF8" alt="Next.js 15" />
  </a>
  &nbsp;
  <a href="./SECURITY.md">
    <img src="https://img.shields.io/badge/SECURITY_AUDIT-0_VULNERABILITIES-0F172A?style=for-the-badge&logo=securityscorecard&logoColor=38BDF8" alt="Security Audit" />
  </a>
</div>

---

### 01 · Multi-Provider Normalization & Cloud Topology

<div align="center">
  <img src="./assets/architecture-diagram.svg" alt="Search Hub Cloud Node Topology" width="100%" />
</div>

**Search Hub Cloud Node (`search-hub-app`)** is a fault-tolerant catalog aggregation and discovery cluster built on **Next.js 15.5**, **React 19**, and **TypeScript 5.5**. It unifies upstream metadata providers (`Jikan` and `TMDb`) into a normalized `MediaItem` contract (`kind:id`) with automatic offline seed fallback so a single upstream outage never degrades application availability.

---

### 02 · Security Hardening & Verification Matrix

`npm audit` reports **0 vulnerabilities**. Every route handler and query parameter is validated against strict server-side allow-lists:

| Attack Vector / Input Probe | Verification Result | Enforcement Layer |
| :--- | :--- | :--- |
| `<script>` payload in `?q=` | Escaped across all DOM/RSC contexts (`0 executable`) | React 19 Auto-Escaping + Route Sanitizer |
| `/api/title/xss:1` or `/api/title/anime:1;DROP` | Rejected with `HTTP 400 Bad Request` | Strict UID Regex Guard `^(anime\|movie\|tv):\d+$` |
| `?page=99999` or `?page=-5` | Clamped deterministically to `1–100` | Pagination Boundary Validator |
| `?sort=../../etc` or `?kind=invalid` | Rejected; safe default applied | Enum Allow-List Guard |
| `/api/health` readiness probe | Returns `200 OK` JSON telemetry | Render & Vercel Edge Health Monitor |

---

### 03 · Repository Structure

```text
search-hub-app/
├── assets/
│   ├── hero-banner.svg          # Vector hero banner & SLA telemetry card
│   └── architecture-diagram.svg # Multi-provider normalization & cloud diagram
├── app/
│   ├── api/
│   │   ├── catalog/route.ts     # Paginated, filtered multi-provider catalog API
│   │   ├── title/[uid]/route.ts # Guarded item detail endpoint
│   │   └── health/route.ts      # Cloud container & edge readiness probe
│   ├── title/[uid]/page.tsx     # Server-rendered detail view & sandboxed trailer player
│   ├── layout.tsx               # App shell, PWA manifest links & typography
│   └── page.tsx                 # Discovery browser entry point
├── components/
│   ├── Browser.tsx              # Client state controller, URL sync & infinite scroll
│   ├── Toolbar.tsx              # Instant search, category filters & sort controls
│   ├── Card.tsx                 # Resilient media tile with fallback artwork
│   └── Player.tsx               # Sandboxed no-cookie trailer frame
├── lib/
│   ├── catalog.ts               # Aggregation, de-duplication, interleaving & sort
│   ├── providers/
│   │   ├── jikan.ts             # MyAnimeList upstream adapter
│   │   └── tmdb.ts              # TMDb upstream adapter (server-only key)
│   ├── fallback.ts              # Deterministic offline seed catalog
│   └── types.ts                 # Normalized MediaItem TypeScript definitions
├── render.yaml                  # Declarative Render container cluster specification
└── vercel.json                  # Vercel Edge headers & routing configuration
```

---

### 04 · Quickstart & Multi-Cloud Deployment

```bash
git clone https://github.com/santoshkumarvvv/search-hub-app.git
cd search-hub-app
npm install
npm run dev
```

- **Zero-Config Local Boot**: Runs immediately out-of-the-box without requiring external API keys. Adding an optional `TMDB_API_KEY` in `.env.local` unlocks live movie and series streams alongside Jikan and the built-in seed catalog.
- **Vercel & Render Ready**: Both `vercel.json` and `render.yaml` are committed at the root for automated continuous deployment.

---

### License

Released under the [MIT License](./LICENSE) · Engineered by **[Santosh Kumar (@santoshkumarvvv)](https://github.com/santoshkumarvvv)**.
