import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";
import DashboardCard from "../components/DashboardCard";
import { MARKETPLACE_STATS, TESTIMONIALS } from "../data/mockData";
import { useMarketplace } from "../context/MarketplaceContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { categories } = useMarketplace();
  const [q, setQ] = useState("");

  const featuredCategories = useMemo(() => categories.slice(0, 6), [categories]);

  const goSearch = () => {
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <div>
      <HeroSection
        title={
          <>
            Buy & sell student essentials —
            <span className="cm-gradient-text"> fast</span>,
            <span className="cm-gradient-text"> clean</span>, and
            <span className="cm-gradient-text"> trusted</span>.
          </>
        }
        subtitle="Campus Marketplace helps college students find great deals on books, gadgets, and academic tools — without the clutter."
      >
        <div className="mt-4">
          <SearchBar value={q} onChange={setQ} onSubmit={goSearch} />
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
          <button className="btn btn-primary cm-btn-gradient btn-lg" onClick={() => navigate("/home")}
            type="button">
            Explore Marketplace
          </button>
          <Link className="btn btn-outline-primary btn-lg" to="/add-product">
            Sell an item
          </Link>
        </div>
        <div className="small cm-muted mt-3">
          Only student-relevant categories. Mobile-first and interview-ready UI.
        </div>
      </HeroSection>

      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between gap-3 mb-3">
            <div>
              <div className="cm-section-title h3 mb-1">Featured categories</div>
              <div className="cm-muted">Browse student-only product types</div>
            </div>
            <Link className="btn btn-outline-secondary" to="/products">
              View all
            </Link>
          </div>

          <div className="row g-3">
            {featuredCategories.map((c) => (
              <div key={c.id} className="col-12 col-md-6 col-lg-4">
                <CategoryCard
                  category={c}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(c.id)}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <DashboardCard title="Active Listings" value={MARKETPLACE_STATS.activeListings.toLocaleString()} icon="activity" />
            </div>
            <div className="col-12 col-md-4">
              <DashboardCard title="Registered Students" value={MARKETPLACE_STATS.registeredStudents.toLocaleString()} icon="people" tone="secondary" />
            </div>
            <div className="col-12 col-md-4">
              <DashboardCard title="Products Sold" value={MARKETPLACE_STATS.productsSold.toLocaleString()} icon="bag-check" tone="success" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between gap-3 mb-3">
            <div>
              <div className="cm-section-title h3 mb-1">Testimonials</div>
              <div className="cm-muted">What students say</div>
            </div>
          </div>

          <div className="row g-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="col-12 col-md-4">
                <div className="cm-glass p-4 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="fw-semibold">{t.name}</div>
                    <div className="text-warning" aria-label="Rating">
                      <i className="bi bi-star-fill" /> <i className="bi bi-star-fill" /> <i className="bi bi-star-fill" /> <i className="bi bi-star-fill" /> <i className="bi bi-star-fill" />
                    </div>
                  </div>
                  <p className="mb-3">“{t.quote}”</p>
                  <div className="small cm-muted">{t.college}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
