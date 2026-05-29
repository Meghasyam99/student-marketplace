export default function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your search or filters.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="cm-glass p-4 p-md-5 text-center">
      <div className="d-flex justify-content-center mb-3">
        <svg width="140" height="110" viewBox="0 0 140 110" role="img" aria-label="Empty state">
          <defs>
            <linearGradient id="cmg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--cm-blue)" />
              <stop offset="1" stopColor="var(--cm-purple)" />
            </linearGradient>
          </defs>
          <rect x="12" y="18" width="116" height="72" rx="18" fill="var(--cm-surface)" stroke="var(--cm-border)" />
          <path d="M30 56h80" stroke="url(#cmg)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="52" cy="56" r="6" fill="url(#cmg)" />
          <circle cx="88" cy="56" r="6" fill="url(#cmg)" />
          <path d="M48 78h44" stroke="var(--cm-border)" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="h4 fw-bold mb-2">{title}</h3>
      <p className="cm-muted mb-0">{description}</p>
      {actionLabel ? (
        <div className="mt-4">
          <button className="btn btn-primary cm-btn-gradient" onClick={onAction} type="button">
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
