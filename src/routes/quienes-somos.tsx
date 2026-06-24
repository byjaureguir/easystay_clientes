import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useLanguage } from "../lib/i18n";

export const Route = createFileRoute("/quienes-somos")({
  component: QuienesSomos,
});

function QuienesSomos() {
  const { t } = useLanguage();

  return (
    <PageShell>
      <Navbar />

      <section className="bg-[#F5F1EB] py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "#B08A4A", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            {t("teamLabel")}
          </p>
          <h1 className="mt-3 font-lora text-4xl text-[#1F1F1F]">{t("teamTitle")}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#888]">
            {t("teamSubtitle")}
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <TeamPhoto src="/team.jpg" alt={t("teamPhotoAlt")} />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {([t("pill1"), t("pill2"), t("pill3")] as string[]).map((pill) => (
              <span
                key={pill}
                style={{ border: "0.5px solid #B08A4A", color: "#B08A4A", fontFamily: "Montserrat, sans-serif", fontSize: "12px", padding: "6px 16px", borderRadius: "999px", background: "transparent" }}
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-[#E8E0D2] bg-white p-8 text-left">
            <h2 className="font-lora text-2xl text-[#1F1F1F]">{t("qsMissionTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#1F1F1F]/70">
              {t("qsMissionText1")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#1F1F1F]/70">
              {t("qsMissionText2")}
            </p>
          </div>

          <div className="mt-10">
            <Link
              to="/explorar"
              className="inline-flex items-center gap-2 rounded-full bg-[#B08A4A] px-7 py-3.5 text-sm font-medium text-white hover:bg-[#9a7740]"
            >
              {t("exploreProperties")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function TeamPhoto({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div style={{ background: "#DCC9A3", height: "380px", borderRadius: "12px", border: "0.5px solid #D8C9B8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B08A4A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <p style={{ fontFamily: "Inter, sans-serif", color: "#B08A4A", fontSize: "13px" }}>{alt}</p>
      </div>
    );
  }
  return (
    <img
      id="team-photo"
      src={src}
      alt={alt}
      style={{ width: "100%", height: "380px", objectFit: "cover", borderRadius: "12px" }}
    />
  );
}
