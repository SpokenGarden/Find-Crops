import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const modalStyles = `
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9998;
}
.auth-modal {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.25);
  padding: 1.5rem 1.6rem;
  position: relative;
  z-index: 9999;
}
.auth-modal-close {
  position: absolute;
  top: 10px;
  right: 12px;
  border: none;
  background: rgba(0,0,0,0.06);
  border-radius: 10px;
  width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1;
}
.auth-modal-close:hover { background: rgba(0,0,0,0.12); }
.auth-modal-title {
  color: #2d6a4f;
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0 0 1.1rem 0;
}
.auth-field {
  display: block;
  margin-bottom: 0.85rem;
  color: #2d6a4f;
  font-weight: 600;
  font-size: 0.92rem;
}
.auth-input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #c4ddd0;
  font-size: 0.95rem;
  margin-top: 0.25rem;
  box-sizing: border-box;
  outline: none;
}
.auth-input:focus { border-color: #2d6a4f; box-shadow: 0 0 0 2px rgba(45,106,79,0.18); }
.auth-submit-btn {
  width: 100%;
  padding: 0.62rem;
  background: #2d6a4f;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.97rem;
  margin-top: 0.25rem;
  transition: background 0.2s;
}
.auth-submit-btn:hover { background: #245a45; }
.auth-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-switch {
  margin-top: 0.9rem;
  text-align: center;
  font-size: 0.9rem;
  color: #4a6b5a;
}
.auth-switch-link {
  color: #2d6a4f;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  text-decoration: underline;
}
.auth-error {
  background: #fff1f1;
  border: 1px solid #f5c6c6;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: #b72b2b;
  font-size: 0.88rem;
  margin-bottom: 0.8rem;
}
.auth-success {
  background: #f0faf4;
  border: 1px solid #b5ddc5;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: #1f5c44;
  font-size: 0.88rem;
  margin-bottom: 0.8rem;
}
`;

export default function AuthModal({ onClose, initialMode = "signin" }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState(initialMode); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const emailRef = useRef(null);

  // Focus email field on open
  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, [mode]);

  const reset = () => {
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await signUp(email.trim(), password);
        if (err) {
          setError(err.message);
        } else if (data?.session) {
          // Supabase confirmed immediately (email verification disabled)
          setSuccessMsg("Account created! You're now signed in.");
          setTimeout(() => onClose(), 1200);
        } else {
          // Email verification required
          setSuccessMsg("Account created! Check your email to confirm, then sign in.");
          setMode("signin");
          setPassword("");
        }
      } else {
        const { error: err } = await signIn(email.trim(), password);
        if (err) {
          setError(err.message);
        } else {
          onClose();
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div
        className="auth-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signup" ? "Create account" : "Sign in"}
        onClick={onClose}
      >
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="auth-modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="auth-modal-title">
            {mode === "signup" ? "🌱 Create Account" : "🌱 Sign In"}
          </h2>

          {error && <div className="auth-error" role="alert">{error}</div>}
          {successMsg && <div className="auth-success" role="status">{successMsg}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <label className="auth-field">
              Email
              <input
                ref={emailRef}
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="auth-field">
              Password
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
            </label>
            <button type="submit" className="auth-submit-btn" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => { setMode("signin"); reset(); }}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => { setMode("signup"); reset(); }}
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
