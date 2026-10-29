import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useMarketplace } from "../context/MarketplaceContext";

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
}

export default function HomePage() {
  const navigate = useNavigate();
  const { categories, products } = useMarketplace();

  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategory !== "all" && p.categoryId !== activeCategory) return false;
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categoryId.toLowerCase().includes(query)
      );
    });
  }, [products, q, activeCategory]);

  const featured = useMemo(
    () => {
      const flagged = filtered.filter((p) => p.flags?.featured).slice(0, 6);
      if (flagged.length > 0) return flagged;
      return sortByDateDesc(filtered).slice(0, 6);
    },
    [filtered]
  );
  const latest = useMemo(() => sortByDateDesc(filtered).slice(0, 6), [filtered]);
  const trending = useMemo(
    () => {
      const flagged = filtered.filter((p) => p.flags?.trending).slice(0, 6);
      if (flagged.length > 0) return flagged;
      return sortByDateDesc(filtered).slice(0, 6);
    },
    [filtered]
  );

  const goListing = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (activeCategory !== "all") params.set("category", activeCategory);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <SearchBar value={q} onChange={setQ} onSubmit={goListing} sticky />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn ${activeCategory === "all" ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
          type="button"
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`btn ${activeCategory === c.id ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
            type="button"
            onClick={() => setActiveCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products match your search"
          description="Try a different keyword or category."
          actionLabel="Clear filters"
          onAction={() => {
            setQ("");
            setActiveCategory("all");
          }}
        />
      ) : (
        <>
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-end gap-2 mb-3">
              <div>
                <div className="cm-section-title h4 mb-0">Featured products</div>
                <div className="small cm-muted">Hand-picked student favorites</div>
              </div>
              <Link className="btn btn-outline-secondary" to="/products">
                View all
              </Link>
            </div>
            <div className="row g-3">
              {featured.map((p) => (
                <div key={p.id} className="col-12 col-md-6 col-lg-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-end gap-2 mb-3">
              <div>
                <div className="cm-section-title h4 mb-0">Latest products</div>
                <div className="small cm-muted">Fresh listings from students</div>
              </div>
              <Link className="btn btn-outline-secondary" to="/products">
                Browse
              </Link>
            </div>
            <div className="row g-3">
              {latest.map((p) => (
                <div key={p.id} className="col-12 col-md-6 col-lg-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="d-flex justify-content-between align-items-end gap-2 mb-3">
              <div>
                <div className="cm-section-title h4 mb-0">Trending</div>
                <div className="small cm-muted">Popular right now on campus</div>
              </div>
              <Link className="btn btn-outline-secondary" to="/products">
                See more
              </Link>
            </div>
            <div className="row g-3">
              {trending.map((p) => (
                <div key={p.id} className="col-12 col-md-6 col-lg-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
