import { useState } from "react";
import { getTagLabel, fmtTaka, verifyReport } from "../lib/dataClient.js";
import { UnverifiedBadge, TagChip } from "./Atoms.jsx";
import { useLang } from "../lib/i18n.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function hasVerifiedLocally(id) {
  try {
    return JSON.parse(localStorage.getItem("shotorko_verified") || "[]").includes(id);
  } catch {
    return false;
  }
}

function rememberVerifiedLocally(id) {
  try {
    const list = JSON.parse(localStorage.getItem("shotorko_verified") || "[]");
    if (!list.includes(id)) localStorage.setItem("shotorko_verified", JSON.stringify([...list, id]));
  } catch {
  }
}

export function ReportCard({ report }) {
  const { t, lang, n } = useLang();
  const [flagged, setFlagged] = useState(false);
  const [verifyCount, setVerifyCount] = useState(report.verificationCount || 0);
  const [verified, setVerified] = useState(() => hasVerifiedLocally(report.id));
  const [verifying, setVerifying] = useState(false);
  const outcomeLabel = report.outcome === "resolved" ? t("reportCard.outcomeResolved") : t("reportCard.outcomeUnresolved");

  async function handleVerify() {
    if (verified || verifying) return;
    setVerifying(true);
    try {
      const updated = await verifyReport(report.id);
      setVerifyCount(updated.verificationCount);
      setVerified(true);
      rememberVerifiedLocally(report.id);
    } catch {
    } finally {
      setVerifying(false);
    }
  }

  return (
    <article className="border border-hairline rounded px-5 py-[18px] mb-[14px] bg-paper-raised">
      <div className="flex justify-between items-start gap-3 mb-2.5 flex-wrap">
        <div>
          <div className="font-semibold text-sm">{report.department} &mdash; {report.visitType}</div>
          <div className="text-sm text-ink-soft mt-0.5">{formatDate(report.createdAt)}</div>
        </div>
        <UnverifiedBadge />
      </div>
      <p className="text-sm my-2.5">{report.text}</p>
      <div className="flex flex-wrap gap-1.5">
        {report.tags.map((t) => <TagChip key={t}>{getTagLabel(t)}</TagChip>)}
      </div>
      <div className="flex gap-4 flex-wrap text-sm text-ink-soft mt-2.5 pt-2.5 border-t border-dashed border-hairline items-center">
        <span><strong className="text-ink">{t("reportCard.cost")}</strong> {fmtTaka(report.costMin, lang)}&ndash;{fmtTaka(report.costMax, lang)}</span>
        <span><strong className="text-ink">{t("reportCard.wait")}</strong> ~{n(report.waitMinutes)} min</span>
        <span><strong className="text-ink">{t("reportCard.communication")}</strong> {n(report.communicationRating)}/{n(5)}</span>
        <span>{outcomeLabel}</span>
        <button
          type="button"
          className={`btn-ghost !px-2.5 !py-1 text-xs ${verified ? "text-teal border-teal" : ""}`}
          disabled={verified || verifying}
          onClick={handleVerify}
          title={t("reportCard.verifyTitle")}
        >
          {verified ? t("reportCard.verifiedByYou") : verifying ? t("reportCard.verifying") : t("reportCard.happenedToMeToo")}
          {verifyCount > 0 && <span className="ml-1 text-ink-soft">&middot; {n(verifyCount)}</span>}
        </button>
        <button
          type="button"
          className="text-ink-soft text-xs underline disabled:no-underline disabled:opacity-70"
          disabled={flagged}
          onClick={() => setFlagged(true)}
        >
          {flagged ? t("reportCard.flaggedForReview") : t("reportCard.flagThisReport")}
        </button>
      </div>
    </article>
  );
}

export function StatStrip({ stats }) {
  const { t, lang, n } = useLang();
  if (!stats) return null;
  const [min, max] = stats.costRange;
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-hairline border border-hairline rounded overflow-hidden my-5">
        <div className="bg-paper-raised px-[18px] py-4">
          <span className="font-sans text-2xl font-semibold text-teal block tabular-nums">{fmtTaka(min, lang)}&ndash;{fmtTaka(max, lang)}</span>
          <span className="text-sm text-ink-soft">{t("stats.costRange")}</span>
        </div>
        <div className="bg-paper-raised px-[18px] py-4">
          <span className="font-sans text-2xl font-semibold text-teal block tabular-nums">{n(stats.medianWait)} min</span>
          <span className="text-sm text-ink-soft">{t("stats.medianWait")}</span>
        </div>
        <div className="bg-paper-raised px-[18px] py-4">
          <span className="font-sans text-2xl font-semibold text-teal block tabular-nums">{n(stats.avgCommunication)} / {n(5)}</span>
          <span className="text-sm text-ink-soft">{t("stats.avgCommunication")}</span>
        </div>
        <div className="bg-paper-raised px-[18px] py-4">
          <span className="font-sans text-2xl font-semibold text-teal block tabular-nums">{n(stats.reportCount)}</span>
          <span className="text-sm text-ink-soft">{t("stats.reportsOnRecord")}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6" aria-label="Most common themes in reports">
        {stats.topTags.map(({ tag, count }) => (
          <TagChip key={tag}>{getTagLabel(tag)} &middot; {n(count)}</TagChip>
        ))}
      </div>
    </>
  );
}
