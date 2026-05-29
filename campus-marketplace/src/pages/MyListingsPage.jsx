import { useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../components/EmptyState";
import { useMarketplace } from "../context/MarketplaceContext";

function formatINR(value) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}

export default function MyListingsPage() {
  const { currentUser, products, deleteProduct, updateProduct, getCategoryById } = useMarketplace();

  const myListings = useMemo(
    () => (currentUser ? products.filter((p) => p.sellerId === currentUser.id) : []),
    [products, currentUser]
  );

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
        {myListings.map((p) => {
          const category = getCategoryById(p.categoryId);
          return (
            <div key={p.id} className="col-12 col-md-6 col-lg-4">
              <div className="cm-card h-100 overflow-hidden">
                <img src={p.imageUrl} alt={p.title} className="cm-product-img cm-image" />
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div className="fw-semibold">{p.title}</div>
                    <div className="fw-bold">{formatINR(p.price)}</div>
                  </div>
                  <div className="small cm-muted mt-1">{category?.name ?? p.categoryId}</div>

                  <div className="d-flex gap-2 mt-3">
                    <Link className="btn btn-outline-primary flex-grow-1" to={`/products/${p.id}`}>
                      View details
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={async () => {
                        try {
                          await updateProduct(p.id, { title: `${p.title} (Edited)` });
                          toast.success("Listing updated");
                        } catch (err) {
                          toast.error(err?.data?.detail || err?.message || "Update failed");
                        }
                      }}
                    >
                      <i className="bi bi-pencil" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={async () => {
                        try {
                          await deleteProduct(p.id);
                          toast.info("Listing deleted");
                        } catch (err) {
                          toast.error(err?.data?.detail || err?.message || "Delete failed");
                        }
                      }}
                    >
                      <i className="bi bi-trash" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="small cm-muted mt-3">
                    Condition: <span className="fw-semibold">{p.condition}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
