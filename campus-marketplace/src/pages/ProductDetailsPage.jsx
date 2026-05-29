import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
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

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const {
  products,
  getUserById,
  getCategoryById,
  isWishlisted,
  toggleWishlist,
  currentUser,
  deleteProduct
} = useMarketplace();

  const product = useMemo(() => products.find((p) => p.id === productId), [products, productId]);
  const seller = useMemo(
  () => (product ? getUserById(product.sellerId) : null),
  [product, getUserById]
  );
  const category = useMemo(
  () => (product ? getCategoryById(product.categoryId) : null),
  [product, getCategoryById]
  );
  const isOwner =
  currentUser &&
  product &&
  currentUser.id === product.sellerId;

  if (!product) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Product not found"
          description="This listing may have been removed."
          actionLabel="Back to products"
          onAction={() => (window.location.href = "/products")}
        />
      </div>
    );
  }

  const saved = isWishlisted(product.id);

  const toggle = async () => {
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
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <Link to="/products" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left" aria-hidden="true" /> Back
        </Link>
        
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={toggle}
          >
            <i className={`bi ${saved ? "bi-heart-fill" : "bi-heart"}`} aria-hidden="true" />
            <span className="ms-2">{saved ? "Saved" : "Save"}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary cm-btn-gradient"
            onClick={() => {
              toast.success(`Contact seller: ${seller?.phone ?? "(no phone)"}`);
            }}
          >
            <i className="bi bi-chat-dots" aria-hidden="true" />
            <span className="ms-2">Contact seller</span>
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="cm-card overflow-hidden">
            <img src={product.imageUrl} alt={product.title} className="cm-image" />
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="cm-glass p-4">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <div className="h3 fw-bold mb-1">{product.title}</div>
                <div className="cm-muted">{category?.name ?? product.categoryId}</div>
              </div>
              <div className="h4 fw-bold mb-0">{formatINR(product.price)}</div>
            </div>

            <hr style={{ borderColor: "var(--cm-border)" }} />

            <div className="row g-3">
              <div className="col-6">
                <div className="small cm-muted">Condition</div>
                <div className="fw-semibold">{product.condition}</div>
              </div>
              <div className="col-6">
                <div className="small cm-muted">Posted</div>
                <div className="fw-semibold">
                  {new Date(product.postedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="col-12">
                <div className="small cm-muted">Description</div>
                <div className="mt-1">{product.description}</div>
              </div>
            </div>

            <hr style={{ borderColor: "var(--cm-border)" }} />

            <div>
              <div className="fw-semibold mb-2">Seller information</div>
              <div className="cm-glass p-3" style={{ boxShadow: "none" }}>
                <div className="d-flex align-items-start justify-content-between gap-3">
                  <div>
                    <div className="fw-semibold">{seller?.fullName ?? "—"}</div>
                    <div className="small cm-muted">{seller?.collegeName ?? "—"}</div>
                  </div>
                  <div className="text-end">
                    <div className="small cm-muted">Phone</div>
                    <div className="fw-semibold">{seller?.phone ?? "—"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4 flex-wrap">

            {isOwner && (
                <>
                <Link
                    to={`/edit-product/${product.id}`}
                    className="btn btn-warning"
                >
                    <i className="bi bi-pencil-square"></i>
                    <span className="ms-2">Edit Product</span>
                </Link>

                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={async () => {
                    const confirmed = window.confirm(
                        "Are you sure you want to delete this product?"
                    );

                    if (!confirmed) return;

                    try {
                        await deleteProduct(product.id);
                        toast.success("Product deleted successfully");
                        window.location.href = "/my-listings";
                    } catch (err) {
                        toast.error(
                        err?.message || "Failed to delete product"
                        );
                    }
                    }}
                >
                    <i className="bi bi-trash"></i>
                    <span className="ms-2">Delete Product</span>
                </button>
                </>
            )}

            <button
                type="button"
                className="btn btn-outline-primary flex-grow-1"
                onClick={toggle}
            >
                <i
                className={`bi ${
                    saved ? "bi-heart-fill" : "bi-heart"
                }`}
                aria-hidden="true"
                />
                <span className="ms-2">
                Save to wishlist
                </span>
            </button>

            <button
                type="button"
                className="btn btn-primary cm-btn-gradient flex-grow-1"
                onClick={() => toast.success("Message sent (mock)")}
            >
                <i className="bi bi-send" aria-hidden="true" />
                <span className="ms-2">
                Contact seller
                </span>
            </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
