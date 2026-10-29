import { useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import { useMarketplace } from "../context/MarketplaceContext";

export default function MyListingsPage() {
  const { currentUser, products } = useMarketplace();

  const myListings = useMemo(
    () => (currentUser ? products.filter((p) => p.sellerId === currentUser.id) : []),
    [products, currentUser]
  );
  console.log("DEBUG:", myListings);

  if (!currentUser) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Login required"
          description="Please login to view your listings."
          actionLabel="Login"
          onAction={() => (window.location.href = "/login")}
        />
      </div>
    );
  }

  if (myListings.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          title="You haven't listed anything yet"
          description="Create your first listing to start selling."
          actionLabel="Add product"
          onAction={() => (window.location.href = "/add-product")}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <div className="h3 fw-bold mb-1">My listings</div>
          <div className="cm-muted">Edit, delete, or view your products.</div>
        </div>
        <Link className="btn btn-primary cm-btn-gradient" to="/add-product">
          <i className="bi bi-plus-circle" aria-hidden="true" /> <span className="ms-2">Add product</span>
        </Link>
      </div>

      <div className="row g-3">
        {myListings.map((p, idx) => (
          <div key={p.id || idx} className="col-12 col-md-6 col-lg-4">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
