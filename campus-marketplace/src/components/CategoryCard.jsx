export default function CategoryCard({ category, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cm-card w-100 text-start p-3 bg-transparent ${active ? "border-primary" : ""}`}
      style={{ borderColor: active ? "var(--cm-blue)" : "var(--cm-border)" }}
    >
      <div className="d-flex align-items-center gap-3">
        <div
          className="d-inline-flex align-items-center justify-content-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundImage: "var(--cm-accent)",
            color: "white",
          }}
        >
          <i className={`bi bi-${category.icon}`} aria-hidden="true" />
        </div>
        <div>
          <div className="fw-semibold">{category.name}</div>
          <div className="small cm-muted">Student-only category</div>
        </div>
      </div>
    </button>
  );
}
