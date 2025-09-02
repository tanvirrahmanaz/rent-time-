import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, DollarSign, Calendar } from 'lucide-react';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ListingsPage({
  postType,                      // "house" | "roommate"
  title = 'Browse Listings',
  subtitle = 'Find the right place for you',
  pageSize = 12,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page') || 1);

  const [loading, setLoading] = useState(true);
  const [items, setItems]   = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(pageFromUrl);

  // filters
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchPosts = async (signal) => {
    const qs = new URLSearchParams();
    if (postType) qs.set('type', postType);
    if (q) qs.set('q', q);                // NOTE: optional (server টেক্সট সার্চ না করলে এইটা বাদ দাও)
    if (location) qs.set('location', location);
    if (minPrice) qs.set('minPrice', minPrice);
    if (maxPrice) qs.set('maxPrice', maxPrice);
    qs.set('page', String(page));
    qs.set('limit', String(pageSize));

    const res = await fetch(`${apiBase}/api/posts?${qs.toString()}`, { signal });
    const json = await res.json();

    // আপনার /api/posts রেসপন্স স্ট্রাকচার: { posts, totalPages, currentPage }
    setItems(json.posts || []);
    setTotalPages(json.totalPages || 1);
  };

  useEffect(() => {
    setLoading(true);
    const ctrl = new AbortController();
    fetchPosts(ctrl.signal).finally(() => setLoading(false));
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('page', String(page));
      return p;
    });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postType, page, q, location, minPrice, maxPrice]);

  const clearFilters = () => {
    setQ('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const nextDisabled = useMemo(() => page >= totalPages, [page, totalPages]);
  const prevDisabled = useMemo(() => page <= 1, [page]);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600">{subtitle}</p>
          {postType && (
            <p className="mt-1 text-xs text-slate-500">
              Showing only: <span className="font-medium">{postType.toUpperCase()}</span>
            </p>
          )}
        </header>

        {/* Filters */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-slate-800">Filters</h2>
          </div>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title/description/location"
              className="px-3 py-2 rounded-lg border border-slate-300"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g., Dhanmondi)"
              className="px-3 py-2 rounded-lg border border-slate-300"
            />
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              className="px-3 py-2 rounded-lg border border-slate-300"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              className="px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-black"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            No listings found.
          </div>
        ) : (
          <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {items.map((item) => (
                <Link
                  key={item._id}
                  to={`/post/${item._id}`}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={item.photos?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={item.title}
                      className="h-44 w-full object-cover"
                    />
                    {item.isBooked && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full">
                        Booked
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-xs text-slate-500">
                      <span className="font-medium">{item.postType?.toUpperCase()}</span> ·{' '}
                      <span className="inline-flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" /> {item.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="inline-flex items-center text-slate-700 font-semibold">
                        <DollarSign className="w-4 h-4 -ml-0.5" />
                        {Number(item.rent).toLocaleString()} BDT
                      </div>
                      <div className="text-xs text-slate-500 inline-flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={prevDisabled}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-lg border ${prevDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
              >
                Prev
              </button>
              <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={nextDisabled}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-4 py-2 rounded-lg border ${nextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
