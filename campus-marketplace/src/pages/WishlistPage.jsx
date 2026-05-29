import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../components/EmptyState";
import { useMarketplace } from "../context/MarketplaceContext";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { products, wishlistIds, toggleWishlist } = useMarketplace();

  const wishlist = useMemo(
    () => products.filter((p) => wishlistIds.has(p.id)),
    [products, wishlistIds]
  );

  const remove = async (id) => {
    try {
      await toggleWishlist(id);
      toast.info("Removed from wishlist");
    } catch (err) {
      if (err?.code === "AUTH_REQUIRED") {
        toast.error("Please login to use wishlist");
        navigate("/login");
        return;
      }
      toast.error(err?.message || "Wishlist update failed");
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Your wishlist is empty"
          description="Save products to revisit and compare later."
          actionLabel="Browse products"
          onAction={() => (window.location.href = "/products")}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <div className="h3 fw-bold mb-1">Wishlist</div>
          <div className="cm-muted">Saved products grid</div>
        </div>
      </div>

      <div className="row g-3">
        {wishlist.map((p) => (
          <div key={p.id} className="col-12 col-md-6 col-lg-4">
            <div className="position-relative">
              <ProductCard product={p} />
              <button
                type="button"
                className="btn btn-outline-danger position-absolute start-0 top-0 m-3 cm-pill"
                onClick={() => remove(p.id)}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
