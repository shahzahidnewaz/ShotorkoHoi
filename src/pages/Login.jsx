import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { Callout, PasswordField } from "../components/Atoms.jsx";
import { useLang } from "../lib/i18n.jsx";

export default function Login() {
  const { t } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      const redirectTo = location.state?.from || (user.role === "admin" ? "/admin" : "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || t("login.genericError"));
      setSubmitting(false);
    }
  }

  return (
    <section className="py-14">
      <div className="max-w-[420px] mx-auto px-5">
        <h1>{t("login.h1")}</h1>
        <p className="text-ink-soft mb-6">
          {t("login.sub")}
        </p>

        {error && (
          <div className="mb-4">
            <Callout tone="brick">{error}</Callout>
          </div>
        )}

        <form
          className="bg-paper-raised border border-hairline rounded-lg p-6 flex flex-col gap-4 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor="login-email">{t("login.email")}</label>
            <input
              id="login-email"
              type="email"
              className="field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <PasswordField
            id="login-password"
            label={t("login.password")}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button type="submit" className="btn-primary justify-center mt-2" disabled={submitting}>
            {submitting ? t("login.loggingIn") : t("login.logIn")}
          </button>
        </form>

        <div className="unverified-badge mt-6">
          {t("login.guestNote")}
        </div>
      </div>
    </section>
  );
}
