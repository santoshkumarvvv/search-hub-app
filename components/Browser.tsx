'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from './Card';
import Toolbar from './Toolbar';
import { collectGenres } from '@/lib/catalog';
import type { MediaItem, MediaKind, Page, SortKey } from '@/lib/types';

/**
 * Catalog browser.
 *
 * URL is the single source of truth: ?q=&kind=&genre=&sort= are written back to
 * the address bar on every change, so any view can be linked and restored.
 */
interface Props {
  initial: Page<MediaItem>;
  /** Filters parsed from the URL on the server, so the first paint matches the link. */
  initialQuery: {
    q: string;
    kind: MediaKind | 'all';
    genre: string;
    sort: SortKey;
  };
  tmdbConfigured?: boolean;
}

const DEBOUNCE_MS = 350;

export default function Browser({ initial, initialQuery, tmdbConfigured = true }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery.q);
  const [kind, setKind] = useState<MediaKind | 'all'>(initialQuery.kind);
  const [genre, setGenre] = useState(initialQuery.genre);
  const [sort, setSort] = useState<SortKey>(initialQuery.sort);
  const [items, setItems] = useState<MediaItem[]>(initial.items);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Guards against a slow response overwriting a newer one.
  const reqId = useRef(0);
  const firstRun = useRef(true);

  const buildQuery = useCallback(
    (p: number) => {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set('q', q.trim());
      if (kind !== 'all') sp.set('kind', kind);
      if (genre !== 'all') sp.set('genre', genre);
      if (sort !== 'popularity') sp.set('sort', sort);
      sp.set('page', String(p));
      return sp.toString();
    },
    [q, kind, genre, sort]
  );

  const load = useCallback(
    async (p: number, append: boolean) => {
      const mine = ++reqId.current;
      setLoading(true);
      if (!append) setStatus(null);
      try {
        const res = await fetch(`/api/catalog?${buildQuery(p)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Page<MediaItem>;
        if (mine !== reqId.current) return; // superseded
        setItems((prev) => (append ? dedupe([...prev, ...data.items]) : data.items));
        setHasMore(data.hasMore);
        setPage(p);
        if (!append && data.items.length === 0) {
          setStatus('No results. Try a different search or filter.');
        }
      } catch (err) {
        if (mine !== reqId.current) return;
        setStatus(`Could not reach the catalog (${(err as Error).message}). Check network connection.`);
        if (!append) setItems([]);
      } finally {
        if (mine === reqId.current) setLoading(false);
      }
    },
    [buildQuery]
  );

  // Sync filters to the URL and refetch, debounced for typing.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set('q', q.trim());
      if (kind !== 'all') sp.set('kind', kind);
      if (genre !== 'all') sp.set('genre', genre);
      if (sort !== 'popularity') sp.set('sort', sort);
      const qs = sp.toString();
      router.replace(qs ? `/?${qs}` : '/', { scroll: false });
      void load(1, false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q, kind, genre, sort, router, load]);

  // Infinite scroll.
  const sentinel = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || loading) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void load(page + 1, true);
      },
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, page, load]);

  const genres = useMemo(() => collectGenres(items), [items]);

  return (
    <>
      <Toolbar
        q={q}
        kind={kind}
        genre={genre}
        sort={sort}
        genres={genres}
        count={items.length}
        loading={loading}
        onQ={setQ}
        onKind={setKind}
        onGenre={setGenre}
        onSort={setSort}
      />
      <main id="grid" className="mx-auto max-w-[1700px] px-4 py-5">
        {/* Visible TMDB Config Status Banner */}
        {!tmdbConfigured && !bannerDismissed && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>
                <strong>Notice:</strong> <code>TMDB_API_KEY</code> is not configured. The engine is running in resilient fallback seed mode (Anime catalog active, Movies/TV in offline seed mode). Set <code>TMDB_API_KEY</code> in your environment variables to enable live TMDb streaming.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="text-amber-400 hover:text-amber-200 underline shrink-0 cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {status && (
          <p className="mb-4 rounded-lg border border-line bg-panel px-4 py-3 text-center text-sm text-muted">
            {status}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {items.map((it) => (
            <Card key={it.uid} item={it} />
          ))}
          {loading &&
            items.length === 0 &&
            Array.from({ length: 16 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="aspect-[2/3] animate-pulse rounded-xl border border-line bg-panel"
              />
            ))}
        </div>
        <div ref={sentinel} className="h-px" aria-hidden="true" />
        {loading && items.length > 0 && (
          <p className="py-8 text-center text-sm text-muted">Loading more…</p>
        )}
        {!hasMore && items.length > 0 && (
          <p className="py-8 text-center text-xs text-muted">End of results</p>
        )}
      </main>
    </>
  );
}

function dedupe(list: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  return list.filter((it) => {
    if (seen.has(it.uid)) return false;
    seen.add(it.uid);
    return true;
  });
}
