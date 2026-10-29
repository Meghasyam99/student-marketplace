function SkeletonBox({ className, style }) {
  return <div className={`cm-skeleton ${className ?? ""}`.trim()} style={style} />;
}

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="row g-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="col-12 col-md-6 col-lg-4">
          <div className="cm-card overflow-hidden p-0">
            <SkeletonBox className="w-100" style={{ aspectRatio: "16 / 10" }} />
            <div className="p-3">
              <SkeletonBox className="mb-2" style={{ height: 16, width: "78%" }} />
              <SkeletonBox className="mb-3" style={{ height: 16, width: "54%" }} />
              <div className="d-flex gap-2">
                <SkeletonBox style={{ height: 36, width: "70%" }} />
                <SkeletonBox style={{ height: 36, width: "30%" }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
