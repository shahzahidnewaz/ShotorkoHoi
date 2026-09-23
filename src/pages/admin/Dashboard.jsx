import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as admin from "../../lib/adminClient.js";
import { getPlatformStats } from "../../lib/dataClient.js";
import { useAuth } from "../../lib/AuthContext.jsx";
import { EmptyState, ErrorState, SkeletonList } from "../../components/Atoms.jsx";
import { useLang } from "../../lib/i18n.jsx";

function StatCard({ label, value }) {
  return (
    <div className="bg-paper-raised border border-hairline rounded-lg p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-ink-soft mb-1">{label}</p>
      <p className="text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { t, n } = useLang();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [reportStats, setReportStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [userRows, statRows, overviewRows] = await Promise.all([
        admin.listUsers(),
        admin.getStats(),
        getPlatformStats()
      ]);
      setUsers(userRows);
      setReportStats(statRows);
      setOverview(overviewRows);
    } catch (err) {
      setError(err.message || t("dashboard.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function runAction(id, action) {
    setBusyId(id);
    try {
      await action(id);
      await load();
    } catch (err) {
      alert(err.message || t("admin.actionFailed"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    runAction(id, admin.deleteUser);
  }

  const activeUserCount = users.filter((u) => u.status === "active").length;

  return (
    <section className="py-10">
      <div className="max-w-wide mx-auto px-5">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1>{t("dashboard.title")}</h1>
          </div>
          <Link to="/admin/queue" className="btn-secondary">{t("dashboard.goToQueue")}</Link>
        </div>

        {loading && <SkeletonList count={4} />}
        {!loading && error && <ErrorState title={t("admin.errorTitle")} body={error} />}

        {!loading && !error && (
          <>
            <h2 className="mb-4">{t("dashboard.overviewTitle")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              <StatCard label={t("dashboard.pendingReports")} value={n(reportStats?.pending ?? 0)} />
              <StatCard label={t("dashboard.approvedReports")} value={n(reportStats?.approved ?? 0)} />
              <StatCard label={t("dashboard.rejectedReports")} value={n(reportStats?.rejected ?? 0)} />
              <StatCard label={t("dashboard.totalUsers")} value={n(users.length)} />
              <StatCard label={t("dashboard.activeUsers")} value={n(activeUserCount)} />
              <StatCard label={t("dashboard.totalHospitals")} value={n(overview?.totalFacilities ?? 0)} />
            </div>

            <h2 className="mb-1">{t("dashboard.usersSectionTitle")}</h2>
            <p className="text-ink-soft mb-4">{t("admin.usersSub")}</p>

            {users.length === 0 ? (
              <EmptyState title={t("admin.noUsersTitle")} body={t("admin.noUsersBody")} />
            ) : (
              <div className="bg-paper-raised border border-hairline rounded-lg shadow-sm overflow-x-auto mb-10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-hairline text-ink-soft">
                      <th className="px-4 py-3">{t("admin.colName")}</th>
                      <th className="px-4 py-3">{t("admin.colEmail")}</th>
                      <th className="px-4 py-3">{t("admin.colRole")}</th>
                      <th className="px-4 py-3">{t("admin.colStatus")}</th>
                      <th className="px-4 py-3">{t("admin.colJoined")}</th>
                      <th className="px-4 py-3">{t("admin.colActions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSelf = currentUser?.id === u.id;
                      const disabled = busyId === u.id;
                      return (
                        <tr key={u.id} className="border-b border-hairline last:border-0">
                          <td className="px-4 py-3">{u.name}{isSelf && <span className="text-ink-soft"> {t("admin.you")}</span>}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`pill ${u.role === "admin" ? "" : "pill-public"}`}>{u.role === "admin" ? t("admin.admin") : t("admin.user")}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={u.status === "active" ? "text-green" : "text-brick"}>{u.status === "active" ? t("admin.active") : t("admin.inactive")}</span>
                          </td>
                          <td className="px-4 py-3 text-ink-soft">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {u.status === "inactive" ? (
                                <button className="btn-ghost" disabled={disabled} onClick={() => runAction(u.id, admin.activateUser)}>{t("admin.activate")}</button>
                              ) : (
                                <button className="btn-ghost" disabled={disabled || isSelf} onClick={() => runAction(u.id, admin.deactivateUser)}>{t("admin.deactivate")}</button>
                              )}
                              {u.role === "admin" ? (
                                <button className="btn-ghost" disabled={disabled || isSelf} onClick={() => runAction(u.id, admin.demoteUser)}>{t("admin.demote")}</button>
                              ) : (
                                <button className="btn-ghost" disabled={disabled} onClick={() => runAction(u.id, admin.promoteUser)}>{t("admin.promote")}</button>
                              )}
                              <button className="btn-ghost text-brick" disabled={disabled || isSelf} onClick={() => handleDelete(u.id)}>{t("admin.delete")}</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
