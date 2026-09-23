import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchFacilities, getDepartments, getTagLabel, submitReport } from "../lib/dataClient.js";
import { Callout } from "../components/Atoms.jsx";
import { TAGS } from "../lib/mockData.js";
import { useLang } from "../lib/i18n.jsx";

const TOTAL_STEPS = 3;

export default function ReportNew() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    facilityId: params.get("facilityId") || "",
    facilityQuery: "",
    department: "",
    departmentOther: "",
    visitType: "",
    costMin: "",
    costMax: "",
    waitMinutes: "",
    communicationRating: "3",
    tags: [],
    outcome: "",
    text: ""
  });

  useEffect(() => {
    searchFacilities({}).then((rows) => setFacilities(rows.map((r) => r.facility)));
  }, []);
  useEffect(() => {
    if (form.facilityId && !form.facilityQuery) {
      const match = facilities.find((f) => String(f.id) === String(form.facilityId));
      if (match) update("facilityQuery", `${match.name} — ${match.district}`);
    }
  }, [facilities]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFacilityQueryChange(value) {
    setForm((f) => {
      const match = facilities.find(
        (fac) => `${fac.name} — ${fac.district}`.toLowerCase() === value.trim().toLowerCase()
      );
      return { ...f, facilityQuery: value, facilityId: match ? match.id : "" };
    });
  }

  const facilitySuggestions = facilities.slice(0, 50);

  function isPositiveNumber(value) {
    if (value === "" || value === null || value === undefined) return true; 
    if (!/^\d+(\.\d+)?$/.test(String(value).trim())) return false;
    return Number(value) >= 0;
  }

  function toggleTag(tag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag]
    }));
  }

  function validateStep1() {
    const e = {};
    if (!form.facilityId) e.facilityId = t("reportNew.errFacility");
    if (!form.department) e.department = t("reportNew.errDepartment");
    else if (form.department === "others" && !form.departmentOther.trim()) e.departmentOther = t("reportNew.errDepartmentOther");
    if (!form.visitType.trim()) e.visitType = t("reportNew.errVisitType");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (!isPositiveNumber(form.costMin)) e.costMin = t("reportNew.errCostMin");
    if (!isPositiveNumber(form.costMax)) e.costMax = t("reportNew.errCostMax");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e = {};
    if (form.text.trim().length < 30) e.text = t("reportNew.errText");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep3()) return;
    setSubmitting(true);
    try {
      const draft = {
        ...form,
        department: form.department === "others" ? form.departmentOther.trim() : form.department,
        costMin: Number(form.costMin) || 0,
        costMax: Number(form.costMax) || 0,
        waitMinutes: Number(form.waitMinutes) || 0,
        communicationRating: Number(form.communicationRating),
        outcome: form.outcome || "unresolved",
        text: form.text.trim()
      };
      const result = await submitReport(draft);
      if (result.success) navigate("/report/success");
    } catch {
      setSubmitting(false);
      alert(t("reportNew.submitFailed"));
    }
  }

  return (
    <section className="py-10">
      <div className="max-w-wide mx-auto px-5">
        <h1>{t("reportNew.h1")}</h1>
        <p className="text-ink-soft max-w-[60ch] mb-8">
          {t("reportNew.sub1")}{" "}
          <strong className="text-ink">{t("reportNew.subBold")}</strong>.
        </p>

        <div className="max-w-content">
          <div className="flex gap-1.5 mb-7" aria-hidden="true">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1 rounded-full ${s < step ? "bg-teal" : s === step ? "bg-brick" : "bg-hairline"}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {step === 1 && (
              <fieldset>
                <Field label={t("reportNew.facility")} error={errors.facilityId}>
                  <input
                    type="text"
                    className="field"
                    list="facility-suggestions"
                    value={form.facilityQuery}
                    onChange={(e) => handleFacilityQueryChange(e.target.value)}
                    placeholder={t("reportNew.selectFacility")}
                    autoComplete="off"
                  />
                  <datalist id="facility-suggestions">
                    {facilitySuggestions.map((f) => (
                      <option key={f.id} value={`${f.name} — ${f.district}`} />
                    ))}
                  </datalist>
                  {!errors.facilityId && form.facilityQuery && !form.facilityId && (
                    <p className="text-sm text-ink-soft mt-1">{t("reportNew.facilityNoMatch")}</p>
                  )}
                </Field>

                <Field label={t("reportNew.department")} error={errors.department}>
                  <select className="field" value={form.department} onChange={(e) => update("department", e.target.value)}>
                    <option value="">{t("reportNew.selectDepartment")}</option>
                    {getDepartments().map((d) => <option key={d} value={d}>{d}</option>)}
                    <option value="others">{t("reportNew.departmentOther")}</option>
                  </select>
                </Field>

                {form.department === "others" && (
                  <Field label={t("reportNew.departmentOther")} error={errors.departmentOther}>
                    <input
                      type="text"
                      className="field"
                      value={form.departmentOther}
                      onChange={(e) => update("departmentOther", e.target.value)}
                      placeholder={t("reportNew.departmentOtherPlaceholder")}
                    />
                  </Field>
                )}

                <Field label={t("reportNew.visitType")} hint={t("reportNew.visitTypeHint")} error={errors.visitType}>
                  <input
                    type="text" className="field" value={form.visitType}
                    onChange={(e) => update("visitType", e.target.value)}
                    placeholder={t("reportNew.visitTypePlaceholder")}
                  />
                </Field>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <div className="mb-[22px]">
                  <label className="block font-semibold text-sm mb-1.5">{t("reportNew.approxCost")}</label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs mb-1 text-ink-soft">{t("reportNew.minimum")}</label>
                      <input type="number" min="0" step="1" className="field" placeholder="0"
                        value={form.costMin} onChange={(e) => update("costMin", e.target.value)} />
                      {errors.costMin && <p className="text-sm text-brick mt-1">{errors.costMin}</p>}
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs mb-1 text-ink-soft">{t("reportNew.maximum")}</label>
                      <input type="number" min="0" step="1" className="field" placeholder="0"
                        value={form.costMax} onChange={(e) => update("costMax", e.target.value)} />
                      {errors.costMax && <p className="text-sm text-brick mt-1">{errors.costMax}</p>}
                    </div>
                  </div>
                  <p className="text-sm text-ink-soft mt-1">{t("reportNew.noCostHint")}</p>
                </div>

                <Field label={t("reportNew.approxWait")}>
                  <input type="number" min="0" className="field" placeholder={t("reportNew.waitPlaceholder")}
                    value={form.waitMinutes} onChange={(e) => update("waitMinutes", e.target.value)} />
                </Field>

                <Field label={t("reportNew.communicationLabel")}>
                  <select className="field" value={form.communicationRating}
                    onChange={(e) => update("communicationRating", e.target.value)}>
                    <option value="5">{t("reportNew.commOption5")}</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">{t("reportNew.commOption1")}</option>
                  </select>
                </Field>

                <div className="mb-[22px]">
                  <label className="block font-semibold text-sm mb-1.5">{t("reportNew.standOut")}</label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)}
                        className={`text-sm px-3.5 py-1.5 rounded-full border ${form.tags.includes(tag) ? "bg-teal text-white border-teal" : "border-hairline-strong bg-paper-raised"}`}>
                        {getTagLabel(tag)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-[22px]">
                  <label className="block font-semibold text-sm mb-1.5">{t("reportNew.issueResolved")}</label>
                  <div className="flex gap-2">
                    {[["resolved", t("reportNew.resolved")], ["unresolved", t("reportNew.unresolved")]].map(([o, label]) => (
                      <button key={o} type="button" onClick={() => update("outcome", o)}
                        className={`text-sm px-3.5 py-1.5 rounded-full border ${form.outcome === o ? "bg-teal text-white border-teal" : "border-hairline-strong bg-paper-raised"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset>
                <Field
                  label={t("reportNew.describe")}
                  hint={t("reportNew.describeHint", { count: form.text.length })}
                  error={errors.text}
                >
                  <textarea
                    className="field" rows={6} maxLength={1200}
                    value={form.text} onChange={(e) => update("text", e.target.value)}
                    placeholder={t("reportNew.describePlaceholder")}
                  />
                </Field>
                <Callout tone="brick">
                  {t("reportNew.confirmNote")} <strong>{t("reportNew.unverifiedWord")}</strong>{" "}
                  {t("reportNew.confirmNoteEnd")}
                </Callout>
              </fieldset>
            )}

            <div className="flex justify-between gap-3 mt-8 flex-col-reverse sm:flex-row">
              {step > 1 && <button type="button" className="btn-ghost" onClick={handleBack}>{t("reportNew.back")}</button>}
              {step < TOTAL_STEPS && <button type="button" className="btn-primary ml-auto" onClick={handleNext}>{t("reportNew.continue")}</button>}
              {step === TOTAL_STEPS && (
                <button type="submit" className="btn-primary ml-auto" disabled={submitting}>
                  {submitting ? t("reportNew.submitting") : t("reportNew.submit")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div className="mb-[22px]">
      <label className="block font-semibold text-sm mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="text-sm text-ink-soft mt-1">{hint}</p>}
      {error && <p className="text-sm text-brick mt-1">{error}</p>}
    </div>
  );
}
