import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMarketplace } from "../context/MarketplaceContext";
import { extractErrorMessage } from "../api/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useMarketplace();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    const trimmed = identifier.trim();
    if (!trimmed) {
      toast.error("Please enter your email or username");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setSubmitting(true);
    try {
      const profile = await login({ identifier: trimmed, email: trimmed, password });
      const firstName = (profile?.fullName || "").split(" ")[0] || "";
      toast.success(firstName ? `Welcome back, ${firstName}!` : "Welcome back!");
      if (remember) toast.info("Session will be remembered on this device");
      navigate("/home");
    } catch (err) {
      const msg = extractErrorMessage(err?.data, err?.message || "Login failed");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="cm-glass p-4 p-md-5">
            <div className="mb-4">
              <div className="h3 fw-bold mb-1">Login</div>
              <div className="cm-muted">Sign in to manage listings, wishlist, and profile.</div>
            </div>

            <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Email or Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@college.edu or username"
                  autoComplete="username"
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
                  autoComplete="current-password"
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

              <button
                type="submit"
                className="btn btn-primary cm-btn-gradient btn-lg"
                disabled={submitting}
              >
                {submitting ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="small cm-muted">
                New here? <Link to="/register">Create an account</Link>
              </div>
            </form>

            <hr className="my-4" style={{ borderColor: "var(--cm-border)" }} />
            <div className="small cm-muted">
              Tip: You can log in using either your registered college email or your username.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
