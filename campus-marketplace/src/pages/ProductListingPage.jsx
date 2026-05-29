import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useMarketplace } from "../context/MarketplaceContext";

export default function ProductListingPage() {
  const { categories, products } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchKey = searchParams.toString();

  const initialQ = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 6;

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(t);
  }, [searchKey]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.categoryId !== category) return false;
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categoryId.toLowerCase().includes(query)
      );
    });
  }, [products, q, category]);

  const total = filtered.length;
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const applyUrl = (nextQ, nextCategory) => {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextCategory !== "all") params.set("category", nextCategory);
    setSearchParams(params, { replace: true });
  };

  const onSearch = () => {
    setLoading(true);
    setPage(1);
    applyUrl(q, category);
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <SearchBar value={q} onChange={setQ} onSubmit={onSearch} sticky />
      </div>

      <div className="cm-glass p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="fw-semibold">Category filters</div>
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn ${category === "all" ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
              type="button"
              onClick={() => {
                setCategory("all");
                setPage(1);
                setLoading(true);
                applyUrl(q, "all");
              }}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`btn ${category === c.id ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
                type="button"
                onClick={() => {
                  setCategory(c.id);
                  setPage(1);
                  setLoading(true);
                  applyUrl(q, c.id);
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : total === 0 ? (
        <EmptyState
          title="No products found"
          description="Try different keywords or switch categories."
          actionLabel="Clear search"
          onAction={() => {
            setQ("");
            setCategory("all");
            setPage(1);
            setLoading(true);
            applyUrl("", "all");
          }}
        />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="cm-muted">
              Showing <span className="fw-semibold">{paged.length}</span> of {total} products
            </div>
            <div className="small cm-muted">Page {page}</div>
          </div>

          <div className="row g-3">
            {paged.map((p) => (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Pagination
              total={total}
              pageSize={pageSize}
              page={page}
              onPageChange={(next) => setPage(next)}
            />
          </div>
        </>
      )}
    </div>
  );
}
