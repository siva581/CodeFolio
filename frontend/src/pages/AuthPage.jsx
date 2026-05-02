import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { isAuthenticated, signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await signIn(form.email, form.password);
      } else {
        await signUp(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-panel card glass-card">
        <span className="eyebrow">Your Portfolio, Auto-Built</span>
        <h1>{mode === "login" ? "Welcome back" : "Create your portfolio"}</h1>
        <p>
          Stop wasting time building personal websites. Focus on your code—we’ll handle the presentation.
        </p>
        <ul className="feature-list">
          <li>Auto-generate portfolios from your developer data</li>
          <li>Instant sharing with personalized links</li>
          <li>Built for developers, by developers</li>
        </ul>
      </div>

      <section className="card glass-card narrow auth-form-card">
        <h2>{mode === "login" ? "Login" : "Create Account"}</h2>
        <form onSubmit={onSubmit} className="form-grid">
          {mode === "register" && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <button
          className="btn btn-ghost full-width"
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </section>
    </section>
  );
}
