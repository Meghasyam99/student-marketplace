import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-top" style={{ borderColor: "var(--cm-border)" }}>
      <div className="container py-5">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-5">
            <div className="fw-bold fs-5">
              <span className="cm-gradient-text">Campus</span> Marketplace
            </div>
            <p className="cm-muted mt-2 mb-0">
              A student-focused marketplace to buy and sell used academic and campus essentials.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a className="cm-link" href="#" aria-label="Twitter (placeholder)">
                <i className="bi bi-twitter-x" />
              </a>
              <a className="cm-link" href="#" aria-label="Instagram (placeholder)">
                <i className="bi bi-instagram" />
              </a>
              <a className="cm-link" href="#" aria-label="LinkedIn (placeholder)">
                <i className="bi bi-linkedin" />
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <div className="fw-semibold mb-2">Marketplace</div>
            <div className="d-flex flex-column gap-2">
              <Link className="cm-link cm-muted" to="/products">
                Browse Products
              </Link>
              <Link className="cm-link cm-muted" to="/add-product">
                Sell an Item
              </Link>
              <Link className="cm-link cm-muted" to="/wishlist">
                Wishlist
              </Link>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <div className="fw-semibold mb-2">Account</div>
            <div className="d-flex flex-column gap-2">
              <Link className="cm-link cm-muted" to="/login">
                Login
              </Link>
              <Link className="cm-link cm-muted" to="/register">
                Register
              </Link>
              <Link className="cm-link cm-muted" to="/profile">
                Profile
              </Link>
            </div>
          </div>

          <div className="col-12 col-lg-3">
            <div className="fw-semibold mb-2">Support</div>
            <div className="cm-glass p-3">
              <div className="small cm-muted">Email</div>
              <div className="fw-semibold">support@campusmarketplace.local</div>
              <div className="small cm-muted mt-2">Hours</div>
              <div className="fw-semibold">Mon–Sat · 10am–6pm</div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mt-5 pt-4 border-top" style={{ borderColor: "var(--cm-border)" }}>
          <div className="small cm-muted">© {new Date().getFullYear()} Campus Marketplace. All rights reserved.</div>
          <div className="small cm-muted">Built with React + Bootstrap (UI only)</div>
        </div>
      </div>
    </footer>
  );
}
