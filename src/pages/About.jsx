import { useLang } from "../lib/i18n.jsx";

export default function About() {
  const { t, td } = useLang();
  const sections = td("about.sections") || [];
  return (
    <section className="py-12">
      <div className="max-w-content mx-auto px-5">
        <div className="mb-10">
          <h1>{t("about.h1")}</h1>
          <p className="text-ink-soft max-w-[62ch]">
            {t("about.sub")}
          </p>
        </div>

        <div className="flex flex-col gap-5 mb-12">
          {sections.map((s) => (
            <div
              key={s.title}
              className="bg-paper-raised border border-hairline rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-lg mb-2">{s.title}</h2>
              <p className="text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
