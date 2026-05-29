import { useMemo } from "react";

export default function Pagination({ total, pageSize, page, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pages = useMemo(() => {
    const max = Math.min(totalPages, 7);
    const start = Math.max(1, Math.min(page - 3, totalPages - (max - 1)));
    return Array.from({ length: max }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>
            Prev
          </button>
        </li>

        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>
              {p}
            </button>
          </li>
        ))}

        <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
