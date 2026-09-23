import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

export default function Footer() {
  const { t } = useLang();
  const { user } = useAuth();
  return (
    <footer className="border-t border-hairline mt-16 py-8 text-ink-soft text-sm">
      <div className="max-w-wide mx-auto px-5 flex justify-between flex-wrap gap-3">
        <span>{t("footer.copy")}</span>
        <div className="flex gap-4">
          <Link to="/about" className="underline">{t("footer.how")}</Link>
          {!user && <Link to="/login" className="underline">{t("footer.staff")}</Link>}
        </div>
      </div>
    </footer>
  );
}
