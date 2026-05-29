export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products, sellers, colleges…",
  sticky = false,
}) {
  return (
    <div className={sticky ? "cm-sticky" : undefined}>
      <form
        className="cm-glass p-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-transparent border-0">
            <i className="bi bi-search" aria-hidden="true" />
          </span>
          <input
            className="form-control bg-transparent border-0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          <button className="btn btn-primary cm-btn-gradient" type="submit">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
