import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext.jsx";
import { useLang } from "../../lib/i18n.jsx";
import { Avatar, Callout } from "../../components/Atoms.jsx";

const MAX_IMAGE_BYTES = 300 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export default function PersonalDetails() {
  const { t } = useLang();
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [pendingAvatar, setPendingAvatar] = useState(undefined);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setSuccess(false);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t("profile.errImageType"));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(t("profile.errImageSize"));
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAvatarPreview(dataUrl);
      setPendingAvatar(dataUrl);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleRemoveImage() {
    setAvatarPreview(null);
    setPendingAvatar(null);
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t("profile.errNameRequired"));
      return;
    }

    const changes = {};
    if (trimmedName !== user.name) changes.name = trimmedName;
    if (pendingAvatar !== undefined) changes.avatarUrl = pendingAvatar;

    if (Object.keys(changes).length === 0) {
      setSuccess(true);
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile(changes);
      setPendingAvatar(undefined);
      setSuccess(true);
    } catch (err) {
      setError(err.message || t("profile.errSaveFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-10">
      <div className="max-w-[560px] mx-auto px-5">
        <Link to="/" className="text-sm text-ink-soft hover:text-teal">{t("common.back")}</Link>
        <h1 className="mt-2 mb-6">{t("profile.personalDetails")}</h1>

        {error && (
          <div className="mb-4">
            <Callout tone="brick">{error}</Callout>
          </div>
        )}
        {success && !error && (
          <div className="mb-4">
            <Callout>{t("profile.savedSuccessfully")}</Callout>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-paper-raised border border-hairline rounded-lg p-6 flex flex-col gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Avatar name={name || user.name} avatarUrl={avatarPreview} size={72} />
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                className="hidden"
                onChange={handleFileChange}
              />
              <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                {t("profile.uploadImage")}
              </button>
              {avatarPreview && (
                <button type="button" className="btn-ghost text-brick" onClick={handleRemoveImage}>
                  {t("profile.removeImage")}
                </button>
              )}
              <p className="text-xs text-ink-soft">{t("profile.imageHint")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor="profile-name">{t("profile.name")}</label>
            <input
              id="profile-name"
              type="text"
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            <span className="text-ink-soft">{t("profile.email")}</span>
            <span className="break-all">{user.email}</span>
            <span className="text-ink-soft">{t("profile.role")}</span>
            <span className="capitalize">{user.role}</span>
            <span className="text-ink-soft">{t("profile.status")}</span>
            <span className="capitalize">{user.status}</span>
          </div>

          <button type="submit" className="btn-primary self-start" disabled={submitting}>
            {submitting ? t("profile.saving") : t("profile.saveChanges")}
          </button>
        </form>
      </div>
    </section>
  );
}
