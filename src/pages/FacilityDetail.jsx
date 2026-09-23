import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFacility, getReportsForFacility, computeFacilityStats } from "../lib/dataClient.js";
import { StatStrip, ReportCard } from "../components/ReportDisplay.jsx";
import { SkeletonBlock, EmptyState, ErrorState, Callout } from "../components/Atoms.jsx";
import { useLang } from "../lib/i18n.jsx";

export default function FacilityDetail() {
  const { t } = useLang();
  const { id } = useParams();
  const [facility, setFacility] = useState(undefined); 
  const [reports, setReports] = useState([]);
  const [activeDept, setActiveDept] = useState("");

  useEffect(() => {
    setFacility(undefined);
    setActiveDept("");
    (async () => {
      const f = await getFacility(id);
      setFacility(f);
      if (f) {
        const r = await getReportsForFacility(id);
        setReports(r);
        document.title = `${f.name} — ShotorkoHoi`;
      }
    })();
  }, [id]);

  if (!id) {
    return <div className="max-w-wide mx-auto px-5 py-10">
      <ErrorState title={t("facilityDetail.noFacilityTitle")} body={t("facilityDetail.noFacilityBody")} />
    </div>;
  }

  if (facility === undefined) {
    return (
      <div className="max-w-wide mx-auto px-5 py-10">
        <SkeletonBlock className="h-7 w-2/5 mb-2" />
        <SkeletonBlock className="h-4 w-1/4" />
      </div>
    );
  }

  if (facility === null) {
    return (
      <div className="max-w-wide mx-auto px-5 py-10">
        <ErrorState title={t("facilityDetail.notFoundTitle")} body={t("facilityDetail.notFoundBody")} />
      </div>
    );
  }

  const stats = computeFacilityStats(reports);
  const deptWithReports = [...new Set(reports.map((r) => r.department))];
  const filtered = activeDept ? reports.filter((r) => r.department === activeDept) : reports;

  return (
    <>
      <section className="py-8">
        <div className="max-w-wide mx-auto px-5">
          <p className={`pill ${facility.type === "Public" ? "pill-public" : ""}`}>{facility.type}</p>
          <h1>{facility.name}</h1>
          <p className="text-ink-soft">{facility.area}, {facility.district} &middot; {facility.departments.join(" · ")}</p>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-wide mx-auto px-5">
          {stats ? <StatStrip stats={stats} /> : (
            <Callout>{t("facilityDetail.noReportsYet")}</Callout>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-wide mx-auto px-5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-[18px]">
            <h2>{t("facilityDetail.patientReports")}</h2>
            <Link to={`/report/new?facilityId=${facility.id}`} className="btn-secondary">
              {t("facilityDetail.shareHere")}
            </Link>
          </div>

          {deptWithReports.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-[18px]">
              <button
                type="button"
                onClick={() => setActiveDept("")}
                className={`text-sm px-3.5 py-1.5 rounded-full border ${activeDept === "" ? "bg-teal text-white border-teal" : "border-hairline-strong bg-paper-raised"}`}
              >
                {t("common.allDepartments")}
              </button>
              {deptWithReports.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setActiveDept(d)}
                  className={`text-sm px-3.5 py-1.5 rounded-full border ${activeDept === d ? "bg-teal text-white border-teal" : "border-hairline-strong bg-paper-raised"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0
            ? <EmptyState title={t("facilityDetail.noDeptReportsTitle")} body={t("facilityDetail.noDeptReportsBody")} />
            : filtered.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      </section>
    </>
  );
}
