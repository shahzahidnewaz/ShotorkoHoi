import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFacilities, getDistricts } from "../lib/dataClient.js";
import FacilityCard from "../components/FacilityCard.jsx";
import { SkeletonList } from "../components/Atoms.jsx";
import { useLang } from "../lib/i18n.jsx";

export default function Landing() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    setDistricts(getDistricts());
    (async () => {
      const results = await searchFacilities({});
      setRecent(results.slice(0, 6).map(({ facility, reportCount }) => ({ facility, count: reportCount })));
    })();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (district) params.set("district", district);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <>
      <section className="border-b border-hairline py-14">
        <div className="max-w-wide mx-auto px-5">
          <h1 className="max-w-[15ch] text-4xl">{t("landing.h1")}</h1>
          <p className="text-lg text-ink-soft max-w-[56ch] mb-8">
            {t("landing.sub")}
          </p>

          <form onSubmit={handleSubmit} role="search" aria-label="Search hospitals"
            className="bg-paper-raised border border-hairline rounded p-5 flex gap-2.5 flex-wrap items-stretch">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("landing.searchPlaceholder")}
              aria-label="Search hospital or clinic name"
              className="field flex-[2_1_240px]"
            />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              aria-label="Filter by district"
              className="field flex-[1_1_160px]"
            >
              <option value="">{t("common.allDistricts")}</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button type="submit" className="btn-primary">{t("common.search")}</button>
          </form>

          <div className="mt-7 flex gap-7 flex-wrap text-sm text-ink-soft">
            <span><strong className="text-ink">{t("landing.trust1Bold")}</strong> {t("landing.trust1")}</span>
            <span><strong className="text-ink">{t("landing.trust2Bold")}</strong> {t("landing.trust2")}</span>
            <span><strong className="text-ink">{t("landing.trust3Bold")}</strong> {t("landing.trust3")}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-wide mx-auto px-5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
            <h2>{t("landing.recentTitle")}</h2>
            <a href="/search" className="text-sm text-ink-soft hover:text-teal">{t("landing.seeAll")}</a>
          </div>
          {recent === null ? (
            <div className="flex flex-col">
              <SkeletonList count={3} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map(({ facility, count }) => (
                <FacilityCard key={facility.id} facility={facility} reportCount={count} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
