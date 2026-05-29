export default function DashboardCard({ title, value, icon, tone = "primary" }) {
  return (
    <div className="cm-glass p-3 h-100">
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div>
          <div className="small cm-muted">{title}</div>
          <div className="fs-4 fw-bold mt-1">{value}</div>
        </div>
        <div
          className={`d-inline-flex align-items-center justify-content-center rounded-4 text-bg-${tone}`}
          style={{ width: 46, height: 46 }}
        >
          <i className={`bi bi-${icon}`} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
