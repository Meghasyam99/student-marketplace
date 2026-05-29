export default function HeroSection({ title, subtitle, children }) {
  return (
    <section className="cm-hero py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-7">
            <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
              {title}
            </h1>
            <p className="lead cm-muted mb-4">{subtitle}</p>
            {children}
          </div>

          <div className="col-12 col-lg-5">
            <div className="cm-glass p-4">
              <div className="d-flex align-items-start gap-3">
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
                  <i className="bi bi-bag" aria-hidden="true" style={{ fontSize: 22 }} />
                </div>
                <div>
                  <div className="fw-semibold">Student-first marketplace</div>
                  <div className="small cm-muted mt-1">
                    Books, laptops, calculators and campus essentials — all in one place.
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: "var(--cm-border)" }} />

              <div className="row g-3">
                <div className="col-6">
                  <div className="cm-glass p-3" style={{ boxShadow: "none" }}>
                    <div className="small cm-muted">Fast</div>
                    <div className="fw-bold">Search + filters</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="cm-glass p-3" style={{ boxShadow: "none" }}>
                    <div className="small cm-muted">Safe</div>
                    <div className="fw-bold">College context</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="cm-glass p-3" style={{ boxShadow: "none" }}>
                    <div className="small cm-muted">Simple</div>
                    <div className="fw-bold">Wishlist</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="cm-glass p-3" style={{ boxShadow: "none" }}>
                    <div className="small cm-muted">Modern</div>
                    <div className="fw-bold">Premium UI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
