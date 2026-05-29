import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMarketplace } from "../context/MarketplaceContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useMarketplace();

  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !collegeName.trim()) {
      toast.error("Please enter your full name and college name");
      return;
    }
    if (!email.trim().includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        fullName,
        collegeName,
        email: email.trim().toLowerCase(),
        phone,
        password,
        confirmPassword,
      });
      toast.success("Account created");
      navigate("/home");
    } catch (err) {
      const msg =
        err?.data?.email?.[0] ||
        err?.data?.confirm_password?.[0] ||
        err?.data?.detail ||
        err?.message ||
        "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="cm-glass p-4 p-md-5">
            <div className="mb-4">
              <div className="h3 fw-bold mb-1">Create your account</div>
              <div className="cm-muted">Join Campus Marketplace in under a minute.</div>
            </div>

            <form onSubmit={onSubmit} className="row g-3">
              <div className="col-12">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control form-control-lg"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">College Name</label>
                <input
                  className="form-control form-control-lg"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="Your college/university"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
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

              <div className="col-12 col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-control form-control-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary cm-btn-gradient btn-lg w-100">
                  Create account
                </button>
              </div>

              <div className="col-12">
                <div className="small cm-muted">
                  Already have an account? <Link to="/login">Login</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
