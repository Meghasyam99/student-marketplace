import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { useMarketplace } from "../context/MarketplaceContext";

export default function UserProfilePage() {
  const { currentUser, products, wishlistIds, updateProfile } = useMarketplace();
  const [tab, setTab] = useState("profile");

  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [phone, setPhone] = useState("");

  const myListings = useMemo(
    () => (currentUser ? products.filter((p) => p.sellerId === currentUser.id) : []),
    [products, currentUser]
  );

  const wishlist = useMemo(
    () => products.filter((p) => wishlistIds.has(p.id)),
    [products, wishlistIds]
  );

  if (!currentUser) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Login required"
          description="Please login to view and edit your profile."
          actionLabel="Login"
          onAction={() => (window.location.href = "/login")}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <div className="h3 fw-bold mb-1">Profile</div>
          <div className="cm-muted">Manage your account and listings.</div>
        </div>
      </div>

      <div className="cm-glass p-3 p-md-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                backgroundImage: "var(--cm-accent)",
                color: "white",
              }}
            >
              <i className="bi bi-person" aria-hidden="true" style={{ fontSize: 22 }} />
            </div>
            <div>
              <div className="fw-bold fs-5">{currentUser.fullName}</div>
              <div className="small cm-muted">{currentUser.collegeName}</div>
            </div>
          </div>
          <div className="small cm-muted">
            <i className="bi bi-envelope" aria-hidden="true" /> {currentUser.email}
            <span className="mx-2">•</span>
            <i className="bi bi-telephone" aria-hidden="true" /> {currentUser.phone || "—"}
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className={`btn ${tab === "profile" ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
          onClick={() => setTab("profile")}
        >
          Profile information
        </button>
        <button
          type="button"
          className={`btn ${tab === "listings" ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
          onClick={() => setTab("listings")}
        >
          My listings
        </button>
        <button
          type="button"
          className={`btn ${tab === "wishlist" ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
          onClick={() => setTab("wishlist")}
        >
          Wishlist
        </button>
        <button
          type="button"
          className={`btn ${tab === "edit" ? "btn-primary cm-btn-gradient" : "btn-outline-secondary"}`}
          onClick={() => {
            setFullName(currentUser.fullName || "");
            setCollegeName(currentUser.collegeName || "");
            setPhone(currentUser.phone || "");
            setTab("edit");
          }}
        >
          Edit profile
        </button>
      </div>

      {tab === "profile" ? (
        <div className="cm-glass p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="small cm-muted">Full name</div>
              <div className="fw-semibold">{currentUser.fullName}</div>
            </div>
            <div className="col-12 col-md-6">
              <div className="small cm-muted">College</div>
              <div className="fw-semibold">{currentUser.collegeName}</div>
            </div>
            <div className="col-12 col-md-6">
              <div className="small cm-muted">Email</div>
              <div className="fw-semibold">{currentUser.email}</div>
            </div>
            <div className="col-12 col-md-6">
              <div className="small cm-muted">Phone</div>
              <div className="fw-semibold">{currentUser.phone}</div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "listings" ? (
        myListings.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Add your first product to start selling."
            actionLabel="Add product"
            onAction={() => (window.location.href = "/add-product")}
          />
        ) : (
          <div className="row g-3">
            {myListings.map((p) => (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )
      ) : null}

      {tab === "wishlist" ? (
        wishlist.length === 0 ? (
          <EmptyState title="Wishlist is empty" description="Save products you like to compare later." />
        ) : (
          <div className="row g-3">
            {wishlist.map((p) => (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )
      ) : null}

      {tab === "edit" ? (
        <div className="cm-glass p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">College Name</label>
              <input className="form-control" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" value={currentUser.email} readOnly />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Phone</label>
              <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="col-12">
              <button
                type="button"
                className="btn btn-primary cm-btn-gradient"
                onClick={async () => {
                  try {
                    await updateProfile({ fullName: fullName.trim(), collegeName: collegeName.trim(), phone: phone.trim() });
                    toast.success("Profile updated");
                  } catch (err) {
                    const msg = err?.data?.detail || err?.message || "Profile update failed";
                    toast.error(msg);
                  }
                }}
              >
                Save changes
              </button>
              <div className="small cm-muted mt-2">Changes are saved to your backend profile.</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
