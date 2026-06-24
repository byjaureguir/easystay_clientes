import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Star, Heart, Search } from "lucide-react";
import { toast } from "sonner";
import { listings, fmtUSD, nightsBetween, MAX_NIGHTS } from "../lib/listings";
import { Navbar } from "../components/Navbar";
import { PageShell } from "../components/PageShell";
import { Footer } from "../components/Footer";
import { useWishlist } from "../lib/wishlist";
import { useLanguage } from "../lib/i18n";

export const Route = createFileRoute("/explorar")({
  component: Explorar,
});

type ChipKey = "all" | "studio" | "1bed" | "2bed" | "penthouse" | "terrace" | "pets" | "sea";

function match(l: (typeof listings)[number], key: ChipKey, q: string) {
  if (q && !`${l.name} ${l.district}`.toLowerCase().includes(q.toLowerCase())) return false;
  switch (key) {
    case "all": return true;
    case "studio": return l.type === "Estudio";
    case "1bed": return l.type === "1 habitación";
    case "2bed": return l.type === "2 habitaciones";
    case "penthouse": return l.type === "Penthouse";
    case "terrace": return l.terrace;
    case "pets": return l.petFriendly;
    case "sea": return l.seaView;
  }
}

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function Explorar() {
  const [active, setActive] = useState<ChipKey>("all");
  const [q, setQ] = useState("");
  const [checkIn, setCheckIn] = useState(todayPlus(7));
  const [checkOut, setCheckOut] = useState(todayPlus(14));
  const [guestCount, setGuestCount] = useState(2);
  const { has, toggle } = useWishlist();
  const { t } = useLanguage();

  const chips: { key: ChipKey; label: string }[] = [
    { key: "all", label: t("chipAll") },
    { key: "studio", label: t("chipStudio") },
    { key: "1bed", label: t("chip1bed") },
    { key: "2bed", label: t("chip2bed") },
    { key: "penthouse", label: "Penthouse" },
    { key: "terrace", label: t("chipTerrace") },
    { key: "pets", label: t("chipPets") },
    { key: "sea", label: t("chipSeaView") },
  ];

  const nights = nightsBetween(checkIn, checkOut);
  const overLimit = nights > MAX_NIGHTS;
  const validNights = !overLimit && nights > 0;

  const filtered = useMemo(
    () => listings.filter((l) => match(l, active, q)),
    [active, q]
  );

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (overLimit) {
      toast.error(`${t("maxNightsError")} ${MAX_NIGHTS} ${t("maxNightsError2")}`);
      return;
    }
    if (nights <= 0) {
      toast.error(t("validDatesError"));
      return;
    }
    toast.success(`${filtered.length} ${filtered.length === 1 ? t("propertyInLima") : t("propertiesInLima")}`);
  };

  return (
    <PageShell>
      <Navbar />

      {/* Search bar */}
      <section className="border-b border-[#E8E0D2] bg-[#F5F1EB]">
        <div className="mx-auto max-w-7xl px-5 py-5">
          <form
            onSubmit={submitSearch}
            className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-3 shadow-sm sm:flex-nowrap"
          >
            <Field label={t("searchDistrictLabel")}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("searchDistrictPlaceholder")}
                className="ex-input"
              />
            </Field>
            <Field label={t("searchArrivalLabel")}>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={todayPlus(0)} className="ex-input" />
            </Field>
            <Field label={t("searchDepartureLabel")}>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn} className="ex-input" />
            </Field>
            <Field label={t("searchGuestsLabel")}>
              <select value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="ex-input">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? t("guestSingular") : t("guestPlural")}</option>
                ))}
              </select>
            </Field>
            <button type="submit" className="flex items-center gap-2 rounded-full bg-[#B08A4A] px-5 py-3 text-sm font-medium text-white hover:bg-[#9a7740]">
              <Search className="h-4 w-4" /> {t("searchBtn")}
            </button>
          </form>

          {overLimit && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {t("maxNightsError")} {MAX_NIGHTS} {t("maxNightsError2")}
            </p>
          )}
          {validNights && (
            <p className="mt-3 text-xs text-[#1F1F1F]/60">
              {nights} {nights > 1 ? t("nightPlural") : t("nightSingular")} · {t("nightsPriceNote")}
            </p>
          )}
        </div>
      </section>

      {/* Filter chips */}
      <div className="sticky top-[65px] z-30 border-b border-[#E8E0D2] bg-[#FAF8F5]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 scrollbar-none">
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                active === c.key
                  ? "border-[#B08A4A] bg-[#B08A4A] text-white"
                  : "border-[#E8E0D2] bg-white text-[#1F1F1F]/70 hover:border-[#B08A4A] hover:text-[#B08A4A]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h1 className="font-lora text-2xl">
            {filtered.length} {filtered.length === 1 ? t("propertyInLima") : t("propertiesInLima")}
          </h1>
          <span className="text-xs text-[#1F1F1F]/50">{t("updatedToday")}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E8E0D2] py-16 text-center text-sm text-[#1F1F1F]/50">
            {t("noResults")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => {
              const liked = has(l.id);
              const totalStay = validNights ? l.price * nights : null;
              const secondaryTag = l.badge === "Oferta" || l.badge === "Nuevo" || l.badge === "Última unidad" ? l.badge : null;
              return (
                <article
                  key={l.id}
                  className="group overflow-hidden rounded-2xl border border-[#E8E0D2] bg-white transition-all hover:scale-[1.01] hover:border-[#B08A4A]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#DCC9A3]">
                    <Link to="/property/$id" params={{ id: l.id }}>
                      <img src={l.images[0]} alt={l.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </Link>
                    <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {t("badgeAvailable")}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); toggle(l.id); }}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur hover:bg-white"
                      aria-label="Guardar"
                    >
                      <Heart className={`h-4 w-4 ${liked ? "fill-[#B08A4A] text-[#B08A4A]" : "text-[#1F1F1F]/60"}`} />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Link to="/property/$id" params={{ id: l.id }}>
                        <h3 className="font-lora text-lg leading-snug hover:text-[#B08A4A]">{l.name}</h3>
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-[#1F1F1F]/70">
                        <Star className="h-3.5 w-3.5 fill-[#B08A4A] text-[#B08A4A]" />
                        {l.rating.toFixed(1)}
                        <span className="text-[#1F1F1F]/40">({l.reviews})</span>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="flex items-center gap-1 text-xs text-[#1F1F1F]/60">
                        <MapPin className="h-3 w-3 text-[#B08A4A]" /> {l.district}, {l.city}
                      </p>
                      {secondaryTag && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          secondaryTag === "Oferta" ? "bg-[#1F1F1F] text-white"
                          : secondaryTag === "Última unidad" ? "bg-[#B08A4A] text-white"
                          : "border border-[#B08A4A]/40 bg-[#F5F1EB] text-[#B08A4A]"
                        }`}>
                          {secondaryTag === "Oferta" ? t("badgeOffer")
                           : secondaryTag === "Última unidad" ? t("badgeLastUnit")
                           : secondaryTag === "Nuevo" ? t("badgeNew")
                           : secondaryTag}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 flex items-baseline gap-2">
                      <span className="font-lora text-xl text-[#B08A4A]">{fmtUSD(l.price)}</span>
                      <span className="text-xs text-[#1F1F1F]/50">{t("perNight")}</span>
                    </p>
                    {totalStay !== null && (
                      <p className="mt-1 text-xs text-[#1F1F1F]/60">
                        {t("totalNightsLabel")} {nights} {nights > 1 ? t("nightPlural") : t("nightSingular")}:{" "}
                        <span className="font-medium text-[#1F1F1F]">{fmtUSD(totalStay)}</span>
                      </p>
                    )}

                    <Link
                      to="/property/$id"
                      params={{ id: l.id }}
                      className="mt-4 block rounded-full border border-[#B08A4A] py-2 text-center text-xs font-medium text-[#B08A4A] hover:bg-[#B08A4A] hover:text-white"
                    >
                      {t("viewDetail")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />

      <style>{`
        .ex-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E8E0D2;
          background: #FAF8F5;
          padding: 0.625rem 0.875rem;
          font-size: 0.8125rem;
          color: #1F1F1F;
          outline: none;
        }
        .ex-input:focus { border-color: #B08A4A; }
      `}</style>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="min-w-[140px] flex-1">
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#1F1F1F]/60">{label}</span>
      {children}
    </label>
  );
}
