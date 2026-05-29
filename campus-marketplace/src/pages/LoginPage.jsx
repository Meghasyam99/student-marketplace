import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMarketplace } from "../context/MarketplaceContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useMarketplace();

  const [email, setEmail] = useState("aarav@example.com");
  const [password, setPassword] = useState("password");
  const [remember, setRemember] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const profile = await login({ email: email.trim().toLowerCase(), password });
      const firstName = (profile?.fullName || "").split(" ")[0] || "";
      toast.success(firstName ? `Welcome back, ${firstName}!` : "Welcome back!");
      if (remember) toast.info("Session will be remembered on this device");
      navigate("/home");
    } catch (err) {
      const msg = err?.data?.detail || err?.message || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="cm-glass p-4 p-md-5">
            <div className="mb-4">
              <div className="h3 fw-bold mb-1">Login</div>
              <div className="cm-muted">Sign in to manage listings and wishlist.</div>
            </div>

            <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  required
                />
              </div>

              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <a href="#" className="cm-link" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary cm-btn-gradient btn-lg">
                Sign in
              </button>

              <div className="small cm-muted">
                New here? <Link to="/register">Create an account</Link>
              </div>
            </form>

            <hr className="my-4" style={{ borderColor: "var(--cm-border)" }} />
            <div className="small cm-muted">
              Tip: Login uses your Django backend account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
