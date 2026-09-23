import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchFacilities, getDistricts, getDepartments } from "../lib/dataClient.js";
import FacilityCard from "../components/FacilityCard.jsx";
import { SkeletonList, EmptyState, ErrorState } from "../components/Atoms.jsx";
import { useLang } from "../lib/i18n.jsx";

export default function Search() {
  const { t, tp } = useLang();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [district, setDistrict] = useState(params.get("district") || "");
  const [department, setDepartment] = useState(params.get("department") || "");
  const [results, setResults] = useState(null); 
  const [error, setError] = useState(false);

  const districts = getDistricts();
  const departments = getDepartments();

  async function runSearch(q, d, dep) {
    setResults(null);
    setError(false);
    try {
      const rows = await searchFacilities({ query: q, district: d, department: dep });
      setResults(rows.map(({ facility, reportCount }) => ({ facility, count: reportCount })));
    } catch (e) {
      setError(true);
      setResults([]);
    }
  }

  useEffect(() => {
    runSearch(query, district, department);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    if (district) p.set("district", district);
    if (department) p.set("department", department);
    setParams(p);
    runSearch(query, district, department);
  }

  return (
    <>
      <section className="py-8">
        <div className="max-w-wide mx-auto px-5">
          <h1>{t("search.h1")}</h1>
          <form onSubmit={handleSubmit} role="search" aria-label="Search hospitals"
            className="bg-paper-raised border border-hairline rounded p-5 flex gap-2.5 flex-wrap items-stretch">
            <input
              type="text" value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                if (value.trim() === "" && query.trim() !== "") {
                  const p = new URLSearchParams();
                  if (district) p.set("district", district);
                  if (department) p.set("department", department);
                  setParams(p);
                  runSearch("", district, department);
                }
              }}
              placeholder={t("search.placeholder")} aria-label="Search hospital or clinic name"
              className="field flex-[2_1_200px]"
            />
            <select value={district} onChange={(e) => setDistrict(e.target.value)}
              aria-label="Filter by district" className="field flex-[1_1_150px]">
              <option value="">{t("common.allDistricts")}</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}
              aria-label="Filter by department" className="field flex-[1_1_150px]">
              <option value="">{t("common.allDepartments")}</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button type="submit" className="btn-primary">{t("common.search")}</button>
          </form>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-wide mx-auto px-5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
            <h2>{t("search.results")}</h2>
            {results && results.length > 0 && (
              <p className="text-sm text-ink-soft">{tp("search.found", results.length)}</p>
            )}
          </div>
          {results === null && (
            <div className="flex flex-col">
              <SkeletonList count={3} />
            </div>
          )}
          {results !== null && error && (
            <ErrorState title={t("search.errorTitle")} body={t("search.errorBody")} />
          )}
          {results !== null && !error && results.length === 0 && (
            <EmptyState title={t("search.emptyTitle")} body={t("search.emptyBody")} />
          )}
          {results !== null && !error && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map(({ facility, count }) => (
                <FacilityCard key={facility.id} facility={facility} reportCount={count} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
