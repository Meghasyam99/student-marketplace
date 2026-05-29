import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMarketplace } from "../context/MarketplaceContext";
import { useTheme } from "../context/ThemeContext";

function NavItem({ to, label, icon, onClick }) {
  return (
    <li className="nav-item">
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
        }
        end
      >
        {icon ? <i className={`bi bi-${icon}`} aria-hidden="true" /> : null}
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, wishlistIds, logout, isAuthenticated } = useMarketplace();
  const { isDark, toggle } = useTheme();

  const wishlistCount = useMemo(() => wishlistIds.size, [wishlistIds]);

  const close = () => setOpen(false);

  const onLogout = () => {
    logout();
    toast.success("Logged out");
    close();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom" style={{ borderColor: "var(--cm-border)" }}>
      <div className="container py-2">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2" onClick={close}>
          <span className="cm-gradient-text">Campus</span>
          <span>Marketplace</span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none"
            onClick={toggle}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <i className={`bi ${isDark ? "bi-sun" : "bi-moon-stars"}`} aria-hidden="true" />
          </button>
        </div>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-3 mt-lg-0" onClick={close}>
            <NavItem to="/home" label="Home" icon="house" />
            <NavItem to="/products" label="Products" icon="grid" />
            <NavItem to="/add-product" label="Add Product" icon="plus-circle" />
            <NavItem to="/wishlist" label={`Wishlist (${wishlistCount})`} icon="heart" />
            <NavItem to="/my-listings" label="My Listings" icon="collection" />
            <NavItem to="/profile" label="Profile" icon="person" />
            {currentUser?.role === "admin" ? (
              <NavItem to="/admin" label="Admin" icon="speedometer2" />
            ) : null}
          </ul>

          <div className="d-flex align-items-center gap-2" onClick={close}>
            <div className="d-none d-lg-flex align-items-center gap-2 me-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggle}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                <i className={`bi ${isDark ? "bi-sun" : "bi-moon-stars"}`} aria-hidden="true" />
              </button>
            </div>

            {!isAuthenticated ? (
              <>
                <Link className="btn btn-outline-primary" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary cm-btn-gradient" to="/register">
                  Register
                </Link>
              </>
            ) : (
              <div className="d-none d-lg-flex align-items-center ms-2">
                <span className="small cm-muted me-2">{currentUser?.fullName}</span>
                <button className="btn btn-outline-danger" type="button" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="d-lg-none mt-3" onClick={close}>
              <div className="cm-glass p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-semibold">{currentUser?.fullName}</div>
                    <div className="small cm-muted">{currentUser?.collegeName}</div>
                  </div>
                  <button className="btn btn-outline-danger" type="button" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
