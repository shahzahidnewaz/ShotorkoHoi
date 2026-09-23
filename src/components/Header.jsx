import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { useLang } from "../lib/i18n.jsx";
import ProfileMenu from "./ProfileMenu.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm pb-1.5 border-b-2 ${isActive ? "text-teal border-teal" : "text-ink-soft border-transparent hover:text-teal hover:border-teal"}`;

export default function Header() {
  const { lang, toggleLang, t } = useLang();
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-hairline bg-paper sticky top-0 z-20">
      <div className="max-w-wide mx-auto px-5 py-5 flex items-center justify-between gap-4 flex-wrap">
        <Link to="/" className="font-display font-semibold text-2xl tracking-tight">
          <span className="text-ink">Shotorko</span><span className="text-teal">Hoi</span>
        </Link>

        <nav className="flex items-center gap-5 flex-wrap" aria-label="Primary">
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>{t("nav.dashboard")}</NavLink>
          )}
          <NavLink to="/search" className={navLinkClass}>{t("nav.search")}</NavLink>
          <NavLink to="/data" className={navLinkClass}>{t("nav.data")}</NavLink>
          <NavLink to="/about" className={navLinkClass}>{t("nav.about")}</NavLink>

          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language"
            className="text-sm pb-1.5 border-b-2 border-transparent font-semibold text-ink-soft hover:text-teal transition-colors bg-transparent p-0 cursor-pointer"
          >
            {lang === "en" ? "বাংলা" : "English"}
          </button>

          {!loading && user && <ProfileMenu />}
        </nav>
      </div>
    </header>
  );
}
