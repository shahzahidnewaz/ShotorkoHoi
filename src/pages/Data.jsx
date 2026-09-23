import { useEffect, useState } from "react";
import { useLang } from "../lib/i18n.jsx";
import { getPlatformStats, fmtTaka } from "../lib/dataClient.js";

function StatCard({ label, value }) {
  return (
    <div className="bg-paper-raised border border-hairline rounded-lg p-5">
      <div className="text-xs uppercase tracking-wide text-ink-soft mb-1">{label}</div>
      <div className="font-display text-2xl text-ink">{value}</div>
    </div>
  );
}

function BarRow({ label, count, max }) {
  const { n } = useLang();
  const pct = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-40 shrink-0 text-sm text-ink-soft truncate">{label}</div>
      <div className="flex-1 bg-hairline rounded h-2.5 overflow-hidden">
        <div className="bg-teal h-full rounded" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-10 shrink-0 text-right text-sm font-semibold text-ink">{n(count)}</div>
    </div>
  );
}

export default function Data() {
  const { t, lang, n } = useLang();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPlatformStats()
      .then((s) => { if (!cancelled) setStats(s); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-wide mx-auto px-5">
        <div className="mb-10 max-w-content">
          <h1>{t("data.h1")}</h1>
          <p className="text-ink-soft max-w-[62ch]">{t("data.sub")}</p>
          <p className="text-xs text-ink-soft mt-2">{t("data.generatingNote")}</p>
        </div>

        {error && (
          <div className="bg-brick-soft border border-hairline rounded-lg p-6 max-w-content">
            <h2 className="text-lg mb-1">{t("data.errorTitle")}</h2>
            <p className="text-ink-soft">{t("data.errorBody")}</p>
          </div>
        )}

        {!error && !stats && (
          <p className="text-ink-soft">…</p>
        )}

        {!error && stats && stats.totalReports === 0 && (
          <div className="bg-paper-raised border border-hairline rounded-lg p-6 max-w-content">
            <h2 className="text-lg mb-1">{t("data.emptyTitle")}</h2>
            <p className="text-ink-soft">{t("data.emptyBody")}</p>
          </div>
        )}

        {!error && stats && stats.totalReports > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard label={t("data.totalReports")} value={n(stats.totalReports)} />
              <StatCard label={t("data.totalFacilities")} value={n(stats.totalFacilities)} />
              <StatCard label={t("data.totalDistricts")} value={n(stats.totalDistricts)} />
              <StatCard label={t("data.resolvedShare")} value={`${n(stats.resolvedShare)}%`} />
              <StatCard label={t("data.avgCommunication")} value={`${n(stats.avgCommunication)} / ${n(5)}`} />
              <StatCard label={t("data.medianWait")} value={`${n(stats.medianWait)} ${t("data.minutesSuffix")}`} />
              <StatCard
                label={t("data.costRange")}
                value={`${fmtTaka(stats.costRange[0], lang)}–${fmtTaka(stats.costRange[1], lang)}`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <h2 className="text-lg mb-3">{t("data.topIssuesTitle")}</h2>
                <div className="bg-paper-raised border border-hairline rounded-lg p-5">
                  {stats.topTags.map((tag) => (
                    <BarRow
                      key={tag.tag}
                      label={tag.label}
                      count={tag.count}
                      max={stats.topTags[0]?.count || 1}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg mb-3">{t("data.byDepartmentTitle")}</h2>
                <div className="bg-paper-raised border border-hairline rounded-lg p-5">
                  {stats.byDepartment.slice(0, 8).map((d) => (
                    <BarRow
                      key={d.department}
                      label={d.department}
                      count={d.count}
                      max={stats.byDepartment[0]?.count || 1}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-lg mb-3">{t("data.trendTitle")}</h2>
              <div className="bg-paper-raised border border-hairline rounded-lg p-5">
                <div className="flex items-end gap-[3px] h-24">
                  {stats.last30Days.map((d) => {
                    const max = Math.max(1, ...stats.last30Days.map((x) => x.count));
                    const h = Math.max(2, Math.round((d.count / max) * 100));
                    return (
                      <div
                        key={d.date}
                        title={`${d.date}: ${d.count}`}
                        className="flex-1 bg-teal-soft hover:bg-teal rounded-sm transition-colors"
                        style={{ height: `${h}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg mb-3">{t("data.byDistrictTitle")}</h2>
              <div className="bg-paper-raised border border-hairline rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-hairline text-left text-ink-soft">
                      <th className="px-4 py-2 font-semibold">{t("data.districtCol")}</th>
                      <th className="px-4 py-2 font-semibold text-right">{t("data.facilitiesCol")}</th>
                      <th className="px-4 py-2 font-semibold text-right">{t("data.reportsCol")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byDistrict.map((row) => (
                      <tr key={row.district} className="border-b border-hairline last:border-0">
                        <td className="px-4 py-2 text-ink">{row.district}</td>
                        <td className="px-4 py-2 text-right text-ink-soft">{n(row.facilityCount)}</td>
                        <td className="px-4 py-2 text-right text-ink font-semibold">{n(row.reportCount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-paper border border-hairline rounded-lg p-5">
              <h3 className="text-sm mb-1">{t("data.methodologyTitle")}</h3>
              <p className="text-sm text-ink-soft">{t("data.methodologyBody")}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
