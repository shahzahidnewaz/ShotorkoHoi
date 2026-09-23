import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n.jsx";

export default function ReportSuccess() {
  const { t } = useLang();
  return (
    <div className="max-w-content mx-auto px-5">
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-full bg-green-soft text-green flex items-center justify-center mx-auto mb-5 text-2xl">
          &#10003;
        </div>
        <h1>{t("reportSuccess.h1")}</h1>
        <p className="text-ink-soft max-w-[50ch] mx-auto mb-7">
          {t("reportSuccess.body")}
        </p>
        <Link to="/search" className="btn-primary">{t("reportSuccess.searchOthers")}</Link>
      </div>
    </div>
  );
}
