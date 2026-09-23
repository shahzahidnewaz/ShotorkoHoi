import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext.jsx";
import { useLang } from "../../lib/i18n.jsx";
import * as authClient from "../../lib/authClient.js";
import { PasswordField, Callout } from "../../components/Atoms.jsx";

export default function ChangePassword() {
  const { t } = useLang();
  const { user } = useAuth();
  const [fields, setFields] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  function update(field, value) {
    setFields((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fields.currentPassword || !fields.newPassword || !fields.confirmPassword) {
      setError(t("profile.errAllFields"));
      return;
    }
    if (fields.newPassword.length < 8) {
      setError(t("profile.errTooShort"));
      return;
    }
    if (fields.newPassword !== fields.confirmPassword) {
      setError(t("profile.errMismatch"));
      return;
    }

    setSubmitting(true);
    try {
      await authClient.changePassword(fields);
      setSuccess(true);
      setFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || t("profile.errAllFields"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-10">
      <div className="max-w-[420px] mx-auto px-5">
        <Link to="/profile" className="text-sm text-ink-soft hover:text-teal">{t("common.back")}</Link>
        <h1 className="mt-2 mb-6">{t("profile.changePassword")}</h1>

        {error && (
          <div className="mb-4">
            <Callout tone="brick">{error}</Callout>
          </div>
        )}
        {success && (
          <div className="mb-4">
            <Callout>{t("profile.passwordUpdated")}</Callout>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-paper-raised border border-hairline rounded-lg p-6 flex flex-col gap-4 shadow-sm"
          noValidate
        >
          <PasswordField
            id="currentPassword"
            label={t("profile.currentPassword")}
            value={fields.currentPassword}
            onChange={(e) => update("currentPassword", e.target.value)}
            autoComplete="current-password"
          />
          <PasswordField
            id="newPassword"
            label={t("profile.newPassword")}
            value={fields.newPassword}
            onChange={(e) => update("newPassword", e.target.value)}
            autoComplete="new-password"
          />
          <PasswordField
            id="confirmPassword"
            label={t("profile.confirmPassword")}
            value={fields.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            autoComplete="new-password"
          />

          <button type="submit" className="btn-primary mt-1 self-start" disabled={submitting}>
            {submitting ? t("profile.updating") : t("profile.updatePassword")}
          </button>
        </form>
      </div>
    </section>
  );
}
