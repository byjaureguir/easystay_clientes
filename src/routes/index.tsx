import { createFileRoute, Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award, Handshake, FileX, RefreshCw, ChevronDown, Star, MapPin,
  ArrowRight, Search, AlertCircle, Camera,
} from "lucide-react";
import { listings, fmtUSD } from "../lib/listings";
import { PageShell } from "../components/PageShell";
import { Footer } from "../components/Footer";
import { useAuth } from "../lib/auth";
import { useUI } from "../lib/ui";
import { useLanguage } from "../lib/i18n";

export const Route = createFileRoute("/")({
  component: Landing,
});

const featured = listings.slice(0, 3);

function Landing() {
  const { isLoggedIn } = useAuth();
  const { openLock } = useUI();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleEmergency = () => {
    if (isLoggedIn) navigate({ to: "/emergencias" });
    else openLock();
  };

  const pillars = [
    { icon: Award, title: t("pillar1Title"), text: t("pillar1Text") },
    { icon: Handshake, title: t("pillar2Title"), text: t("pillar2Text") },
    { icon: FileX, title: t("pillar3Title"), text: t("pillar3Text") },
    { icon: RefreshCw, title: t("pillar4Title"), text: t("pillar4Text") },
  ];

  const steps = [
    { n: "01", title: t("step1Title"), text: t("step1Text") },
    { n: "02", title: t("step2Title"), text: t("step2Text") },
    { n: "03", title: t("step3Title"), text: t("step3Text") },
  ];

  const stats = [
    { v: "+50", l: t("statProperties") },
    { v: "+1,200", l: t("statGuests") },
    { v: "4.9★", l: t("statRating") },
    { v: "24/7", l: t("statSupport") },
  ];

  const testimonials = [
    { initials: "LR", name: "Lucía Ramírez", stay: t("t1Stay"), text: t("t1Text"), stars: 5 },
    { initials: "DM", name: "Diego Mendoza", stay: t("t2Stay"), text: t("t2Text"), stars: 5 },
    { initials: "AP", name: "Ana Patiño", stay: t("t3Stay"), text: t("t3Text"), stars: 5 },
  ];

  return (
    <PageShell>
      {/* Floating nav */}
      <header className="absolute left-0 right-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-white">
          <RouterLink to="/" className="font-lora text-xl tracking-[0.22em]">EASY STAY</RouterLink>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            <a href="#como-funciona" className="hover:text-[#DCC9A3]">{t("howLink")}</a>
            <a href="#espacios" className="hover:text-[#DCC9A3]">{t("spaces")}</a>
            <button onClick={handleEmergency} className="hover:text-[#DCC9A3]">{t("emergencies")}</button>
            <RouterLink to="/login" className="hover:text-[#DCC9A3]">{t("signIn")}</RouterLink>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-full border border-white/60 text-[11px] font-semibold">
              <button
                onClick={() => setLanguage("es")}
                aria-label="Español"
                className={`px-2.5 py-1 transition-colors ${language === "es" ? "bg-white text-[#B08A4A]" : "text-white hover:bg-white/20"}`}
              >
                ES
              </button>
              <span className="w-px self-stretch bg-white/40" />
              <button
                onClick={() => setLanguage("en")}
                aria-label="English"
                className={`px-2.5 py-1 transition-colors ${language === "en" ? "bg-white text-[#B08A4A]" : "text-white hover:bg-white/20"}`}
              >
                EN
              </button>
            </div>
            <RouterLink
              to="/explorar"
              className="rounded-full bg-[#B08A4A] px-4 py-2 text-xs font-medium text-white hover:bg-[#9a7740]"
            >
              {t("explore")}
            </RouterLink>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-3xl px-5 text-center text-white"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#DCC9A3]">
            {t("tagline")}
          </p>
          <h1 className="mt-5 font-lora text-5xl leading-[1.05] text-[#DCC9A3] sm:text-6xl md:text-7xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {t("heroSubtitle")} <br className="hidden sm:block" />
            {t("heroSubtitle2")}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <RouterLink
              to="/explorar"
              className="inline-flex items-center gap-2 rounded-full bg-[#B08A4A] px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/30 transition hover:bg-[#9a7740]"
            >
              {t("exploreBtn")} <ArrowRight className="h-4 w-4" />
            </RouterLink>
            <button
              onClick={handleEmergency}
              className="inline-flex items-center gap-2 rounded-full border border-white/70 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white hover:text-[#1F1F1F]"
            >
              <AlertCircle className="h-4 w-4" /> {t("emergencyBtn")}
            </button>
          </div>
          <p className="mt-8 text-xs text-white/60">
            {t("heroFrom")} <span className="font-medium text-[#DCC9A3]">{t("heroPrice")}</span> · {t("heroNights")}
          </p>
        </motion.div>

        <motion.a
          href="#como-funciona"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
          aria-label="Bajar"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.a>
      </section>

      {/* PILLARS */}
      <section className="bg-[#FAF8F5] py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B08A4A]">{t("whyLabel")}</p>
            <h2 className="mt-3 font-lora text-3xl sm:text-4xl">{t("whyTitle")}</h2>
            <p className="mt-4 text-sm text-[#1F1F1F]/65">{t("whySubtitle")}</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-[#E8E0D2] bg-white p-7 transition hover:border-[#B08A4A] hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F1EB]">
                    <Icon className="h-5 w-5 text-[#B08A4A]" />
                  </div>
                  <h3 className="mt-5 font-lora text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1F1F1F]/65">{p.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="bg-[#F5F1EB] py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B08A4A]">{t("processLabel")}</p>
            <h2 className="mt-3 font-lora text-3xl sm:text-4xl">{t("processTitle")}</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <span className="font-lora text-5xl text-[#B08A4A]/30">{s.n}</span>
                <h3 className="mt-3 font-lora text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1F1F1F]/65">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section id="espacios" className="bg-[#FAF8F5] py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B08A4A]">{t("spacesLabel")}</p>
              <h2 className="mt-3 font-lora text-3xl sm:text-4xl">{t("spacesTitle")}</h2>
            </div>
            <RouterLink to="/explorar" className="hidden items-center gap-1 text-sm text-[#B08A4A] hover:underline sm:inline-flex">
              {t("viewAll")} <ArrowRight className="h-3.5 w-3.5" />
            </RouterLink>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featured.map((l) => (
              <RouterLink
                key={l.id}
                to="/property/$id"
                params={{ id: l.id }}
                className="group overflow-hidden rounded-2xl border border-[#E8E0D2] bg-white transition hover:border-[#B08A4A]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#DCC9A3]">
                  <img src={l.images[0]} alt={l.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-lora text-lg">{l.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#1F1F1F]/60">
                    <MapPin className="h-3 w-3 text-[#B08A4A]" /> {l.district}, {l.city}
                  </p>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-xs text-[#1F1F1F]/50">{t("from")}</span>
                    <span className="font-lora text-xl text-[#B08A4A]">{fmtUSD(l.price)}</span>
                    <span className="text-xs text-[#1F1F1F]/50">{t("perNight")}</span>
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#B08A4A] group-hover:underline">
                    {t("viewMore")} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </RouterLink>
            ))}
          </div>

          <div className="mt-10 text-center">
            <RouterLink to="/explorar" className="inline-flex items-center gap-1 text-sm text-[#B08A4A] hover:underline">
              {t("viewAllProperties")} <ArrowRight className="h-3.5 w-3.5" />
            </RouterLink>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-[#E8E0D2] bg-[#1F1F1F] py-14 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-lora text-4xl text-[#DCC9A3]">{s.v}*</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[11px] italic text-white/40">{t("statNote")}</p>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="bg-[#FAF8F5] py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B08A4A]">{t("testimonialsLabel")}</p>
            <h2 className="mt-3 font-lora text-3xl sm:text-4xl">{t("testimonialsTitle")}</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((tm) => (
              <div key={tm.name} className="rounded-2xl border border-[#E8E0D2] bg-white p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: tm.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#B08A4A] text-[#B08A4A]" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#1F1F1F]/80">"{tm.text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-[#E8E0D2] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCC9A3] text-xs font-medium">
                    {tm.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tm.name}</p>
                    <p className="text-[11px] text-[#1F1F1F]/60">{tm.stay}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="bg-[#F5F1EB] py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "#B08A4A", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            {t("teamLabel")}
          </p>
          <h2 className="mt-3 font-lora text-3xl sm:text-4xl text-[#1F1F1F]">{t("teamTitle")}</h2>
          <p className="mx-auto mt-4 max-w-[600px] text-sm leading-relaxed text-[#888]">{t("teamSubtitle")}</p>
          <div className="mx-auto mt-6 max-w-[700px]">
            <TeamPhotoBlock src="/team.jpg" />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {([t("pill1"), t("pill2"), t("pill3")] as string[]).map((pill) => (
              <span
                key={pill}
                style={{ border: "0.5px solid #B08A4A", color: "#B08A4A", fontFamily: "Montserrat, sans-serif", fontSize: "12px", padding: "6px 16px", borderRadius: "999px", background: "transparent" }}
              >
                {pill}
              </span>
            ))}
          </div>
          <RouterLink
            to="/quienes-somos"
            className="mt-4 block text-sm text-[#B08A4A] hover:underline"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", textDecoration: "none" }}
          >
            {t("teamLink")}
          </RouterLink>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#FAF8F5] py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-lora text-3xl sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mt-4 text-sm text-[#1F1F1F]/65">{t("ctaSubtitle")}</p>
          <RouterLink
            to="/explorar"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#B08A4A] px-7 py-3.5 text-sm font-medium text-white hover:bg-[#9a7740]"
          >
            <Search className="h-4 w-4" /> {t("exploreBtn")}
          </RouterLink>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function TeamPhotoBlock({ src }: { src: string }) {
  const [imgError, setImgError] = useState(false);
  if (!src || imgError) {
    return (
      <div style={{ background: "#DCC9A3", height: "380px", borderRadius: "12px", border: "0.5px solid #D8C9B8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <Camera className="h-10 w-10 text-[#B08A4A]" strokeWidth={1} />
        <p style={{ fontFamily: "Inter, sans-serif", color: "#B08A4A", fontSize: "13px" }}>Foto del equipo</p>
      </div>
    );
  }
  return (
    <img
      id="team-photo"
      src={src}
      alt="Equipo Easy Stay"
      onError={() => setImgError(true)}
      style={{ width: "100%", height: "380px", objectFit: "cover", borderRadius: "12px" }}
    />
  );
}
