import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n.jsx";

export default function FacilityCard({ facility, reportCount }) {
  const { tp } = useLang();
  return (
    <Link
      to={`/facility/${facility.id}`}
      className="flex flex-col gap-3 h-full p-5 bg-paper-raised border border-hairline rounded-lg shadow-sm hover:shadow-md hover:border-teal transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-sans font-semibold text-lg leading-snug group-hover:text-teal group-hover:underline">
          {facility.name}
        </p>
        <span className={`pill shrink-0 ${facility.type === "Public" ? "pill-public" : ""}`}>
          {facility.type}
        </span>
      </div>

      <p className="text-sm text-ink-soft">{facility.area}, {facility.district}</p>

      <p className="text-sm text-ink-soft flex-1">{facility.departments.join(" · ")}</p>

      <div className="pt-3 mt-auto border-t border-hairline flex items-center justify-between text-sm font-semibold text-teal">
        <span>{tp("common.reportsCount", reportCount)}</span>
        <span aria-hidden="true">&rarr;</span>
      </div>
    </Link>
  );
}
