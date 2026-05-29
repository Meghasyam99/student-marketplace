import { useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ProductCard({ product }) {
  const { getUserById, getCategoryById, isWishlisted, toggleWishlist } = useMarketplace();
  const seller = useMemo(() => getUserById(product.sellerId), [getUserById, product.sellerId]);
  const category = useMemo(
    () => getCategoryById(product.categoryId),
    [getCategoryById, product.categoryId]
  );
  const saved = isWishlisted(product.id);

  const onToggleWishlist = async () => {
    try {
      await toggleWishlist(product.id);
      toast.info(saved ? "Removed from wishlist" : "Saved to wishlist");
    } catch (err) {
      if (err?.code === "AUTH_REQUIRED") {
        toast.error("Please login to use wishlist");
        return;
      }
      toast.error(err?.message || "Wishlist update failed");
    }
  };

  return (
    <div className="cm-card h-100 overflow-hidden">
      <div className="position-relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="cm-product-img cm-image"
          loading="lazy"
        />

        <button
          type="button"
          className="btn btn-light position-absolute top-0 end-0 m-3 cm-pill"
          onClick={onToggleWishlist}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          title={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <i
            className={`bi ${saved ? "bi-heart-fill" : "bi-heart"}`}
            style={{ color: saved ? "var(--cm-purple)" : "inherit" }}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="p-3 d-flex flex-column gap-2">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div className="fw-semibold" style={{ lineHeight: 1.2 }}>
            {product.title}
          </div>
          <div className="fw-bold">{formatINR(product.price)}</div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <span className="badge text-bg-secondary">{product.condition}</span>
          <span className="badge" style={{ backgroundImage: "var(--cm-accent)" }}>
            {category?.name ?? product.categoryId.replace(/-/g, " ")}
          </span>
        </div>

        <div className="small cm-muted">
          <div className="d-flex justify-content-between">
            <span>
              <i className="bi bi-person" aria-hidden="true" /> {seller?.fullName ?? "—"}
            </span>
            <span>
              <i className="bi bi-clock" aria-hidden="true" /> {formatDate(product.postedAt)}
            </span>
          </div>
          <div className="mt-1">
            <i className="bi bi-mortarboard" aria-hidden="true" /> {seller?.collegeName ?? "—"}
          </div>
        </div>

        <div className="d-flex gap-2 mt-2">
          <Link className="btn btn-outline-primary flex-grow-1" to={`/products/${product.id}`}>
            View details
          </Link>
          <Link className="btn btn-primary cm-btn-gradient" to={`/products/${product.id}`}>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
