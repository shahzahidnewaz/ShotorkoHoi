import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as admin from "../../lib/adminClient.js";
import { EmptyState, ErrorState, SkeletonList } from "../../components/Atoms.jsx";
import { fmtTaka, getTagLabel } from "../../lib/dataClient.js";
import { useLang } from "../../lib/i18n.jsx";

const STATUSES = ["pending", "approved", "rejected"];

export default function AdminQueue() {
  const { t, lang, n } = useLang();
  const STATUS_LABELS = {
    pending: t("admin.statusPending"),
    approved: t("admin.statusApproved"),
    rejected: t("admin.statusRejected")
  };
  const [status, setStatus] = useState("pending");
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [reportRows, statRows] = await Promise.all([admin.listReports(status), admin.getStats()]);
      setReports(reportRows);
      setStats(statRows);
    } catch (err) {
      setError(err.message || t("admin.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function handleApprove(id) {
    setBusyId(id);
    try {
      await admin.approveReport(id);
      await load();
    } catch (err) {
      alert(err.message || t("admin.approveFailed"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    const reason = window.prompt(t("admin.rejectPrompt"), "");
    if (reason === null) return; 
    setBusyId(id);
    try {
      await admin.rejectReport(id, reason);
      await load();
    } catch (err) {
      alert(err.message || t("admin.rejectFailed"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="py-10">
      <div className="max-w-wide mx-auto px-5">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1>{t("admin.queueTitle")}</h1>
            <p className="text-ink-soft">{t("admin.queueSub")}</p>
          </div>
          <Link to="/admin" className="btn-secondary">{t("admin.manageUsers")}</Link>
        </div>

        {stats && (
          <div className="flex gap-3 mb-6 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`btn ${status === s ? "bg-teal text-white border-transparent" : "bg-white text-ink-soft border-hairline-strong"}`}
              >
                {STATUS_LABELS[s]} ({n(stats[s] ?? 0)})
              </button>
            ))}
          </div>
        )}

        {loading && <SkeletonList count={4} />}
        {!loading && error && <ErrorState title={t("admin.errorTitle")} body={error} />}
        {!loading && !error && reports.length === 0 && (
          <EmptyState title={t("admin.nothingHereTitle")} body={t("admin.nothingHereBody", { status: STATUS_LABELS[status].toLowerCase() })} />
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="flex flex-col gap-4">
            {reports.map((r) => (
              <article key={r.id} className="bg-paper-raised border border-hairline rounded-lg p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                  <div>
                    <h3 className="mb-0.5">{r.facilityName}</h3>
                    <p className="text-sm text-ink-soft m-0">
                      {r.facilityDistrict} &middot; {r.department} &middot; {r.visitType}
                    </p>
                  </div>
                  <span className="pill">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>

                <p className="my-3">{r.text}</p>

                <div className="flex flex-wrap gap-3 text-sm text-ink-soft mb-3">
                  <span>{t("admin.cost")} {fmtTaka(r.costMin, lang)}&ndash;{fmtTaka(r.costMax, lang)}</span>
                  <span>{t("admin.wait")} {n(r.waitMinutes)} min</span>
                  <span>{t("admin.communication")} {n(r.communicationRating)}/{n(5)}</span>
                  <span>{t("admin.outcome")} {r.outcome}</span>
                </div>

                {r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {r.tags.map((tag) => <span key={tag} className="tag-chip">{getTagLabel(tag)}</span>)}
                  </div>
                )}

                {r.status === "rejected" && r.rejectionReason && (
                  <p className="text-sm text-brick mb-3">{t("admin.rejected")} {r.rejectionReason}</p>
                )}

                {status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={busyId === r.id}
                      onClick={() => handleApprove(r.id)}
                    >
                      {t("admin.approve")}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      disabled={busyId === r.id}
                      onClick={() => handleReject(r.id)}
                    >
                      {t("admin.reject")}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
