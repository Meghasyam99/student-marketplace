import { useMemo } from "react";
import { toast } from "react-toastify";
import DashboardCard from "../components/DashboardCard";
import { useMarketplace } from "../context/MarketplaceContext";

function formatINR(value) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}

export default function AdminDashboardPage() {
  const { users, products, deleteProduct, getUserById, getCategoryById } = useMarketplace();

  const reportedProducts = useMemo(() => products.slice(0, Math.min(3, products.length)), [products]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <div className="h3 fw-bold mb-1">Admin dashboard</div>
          <div className="cm-muted">Manage users, products, and spam listings.</div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <DashboardCard title="Total users" value={users.length.toLocaleString()} icon="people" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DashboardCard title="Total products" value={products.length.toLocaleString()} icon="grid" tone="secondary" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DashboardCard title="Active listings" value={products.length.toLocaleString()} icon="activity" tone="success" />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DashboardCard title="Reported products" value={reportedProducts.length.toLocaleString()} icon="flag" tone="warning" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="cm-glass p-3 p-md-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <div className="fw-bold">Manage users</div>
              <div className="small cm-muted">Mock admin actions</div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>College</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-semibold">{u.fullName}</td>
                      <td className="cm-muted">{u.collegeName}</td>
                      <td className="cm-muted">{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === "admin" ? "text-bg-dark" : "text-bg-secondary"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => toast.info("User removed (mock)")}
                          disabled={u.role === "admin"}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="cm-glass p-3 p-md-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <div className="fw-bold">Manage products</div>
              <div className="small cm-muted">Remove spam listings</div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const seller = getUserById(p.sellerId);
                    const category = getCategoryById(p.categoryId);
                    return (
                      <tr key={p.id}>
                        <td className="fw-semibold">{p.title}</td>
                        <td className="cm-muted">{category?.name ?? p.categoryId}</td>
                        <td className="cm-muted">{seller?.fullName ?? "—"}</td>
                        <td className="fw-semibold">{formatINR(p.price)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={async () => {
                              try {
                                await deleteProduct(p.id);
                                toast.success("Listing removed");
                              } catch (err) {
                                toast.error(err?.data?.detail || err?.message || "Remove failed");
                              }
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
