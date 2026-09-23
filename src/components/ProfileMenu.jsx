import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { useLang } from "../lib/i18n.jsx";
import { Avatar } from "./Atoms.jsx";

export default function ProfileMenu() {
  const { t } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        aria-expanded={open}
        aria-label={t("profile.button")}
      >
        <Avatar name={user.name} avatarUrl={user.avatarUrl} size={36} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-paper-raised border border-hairline rounded-lg shadow-lg p-2 z-30 text-sm">
          <div className="flex items-center gap-3 p-3 border-b border-hairline mb-1">
            <Avatar name={user.name} avatarUrl={user.avatarUrl} size={40} />
            <div className="min-w-0">
              <p className="text-ink font-semibold truncate">{user.name}</p>
              <p className="text-ink-soft text-xs truncate">{user.email}</p>
            </div>
          </div>

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded hover:bg-hairline text-ink"
          >
            {t("profile.personalDetails")}
          </Link>
          <Link
            to="/profile/password"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded hover:bg-hairline text-ink"
          >
            {t("profile.changePassword")}
          </Link>

          <div className="border-t border-hairline mt-1 pt-1">
            <button
              type="button"
              className="block w-full text-left px-3 py-2 rounded hover:bg-hairline text-brick"
              onClick={handleLogout}
            >
              {t("profile.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
