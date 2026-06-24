import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft, MapPin, Star, BedDouble, Bath, Maximize2, Users,
  Wifi, Snowflake, ChefHat, Car, Waves, Dumbbell, ShieldCheck, Shirt,
  Tv, Droplets, ArrowUpDown, Square, X, Pin, BadgeCheck, Check, Minus, Lock,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { getListing, nightsBetween, computeCost, fmtUSD, MAX_NIGHTS } from "../lib/listings";
import { PageShell } from "../components/PageShell";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CertificationBadge } from "../components/CertificationBadge";
import { useLanguage } from "../lib/i18n";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/property/$id")({
  component: Property,
});

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "WiFi": Wifi, "A/C": Snowflake, "Cocina equipada": ChefHat, "Estacionamiento": Car,
  "Piscina": Waves, "Gimnasio": Dumbbell, "Seguridad 24h": ShieldCheck, "Lavandería": Shirt,
  "Balcón": Square, "Smart TV": Tv, "Agua caliente": Droplets, "Ascensor": ArrowUpDown,
};

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function Property() {
  const { id } = useParams({ from: "/property/$id" });
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { reservations } = useAuth();
  const l = getListing(id);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState(todayPlus(7));
  const [checkOut, setCheckOut] = useState(todayPlus(14));

  const nights = nightsBetween(checkIn, checkOut);
  const overLimit = nights > MAX_NIGHTS;
  const cost = useMemo(
    () => computeCost(l?.price ?? 0, overLimit ? 0 : nights),
    [l?.price, nights, overLimit]
  );

  // Feature name translation map
  const featMap: Record<string, string> = {
    "WiFi": "WiFi",
    "A/C": "A/C",
    "Smart TV": "Smart TV",
    "Cocina equipada": t("featKitchen"),
    "Estacionamiento": t("featParking"),
    "Piscina": t("featPool"),
    "Gimnasio": t("featGym"),
    "Seguridad 24h": t("featSecurity24"),
    "Lavandería": t("featLaundry"),
    "Balcón": t("featBalcony"),
    "Agua caliente": t("featHotWater"),
    "Ascensor": t("featElevator"),
  };

  const reviews = [
    { name: "Lucía R.", date: t("reviewDate1"), rating: 5, comment: t("reviewComment1") },
    { name: "Diego M.", date: t("reviewDate2"), rating: 5, comment: t("reviewComment2") },
    { name: "Ana P.", date: t("reviewDate3"), rating: 4, comment: t("reviewComment3") },
  ];

  const verifyItems = [t("verifyItem1"), t("verifyItem2"), t("verifyItem3"), t("verifyItem4"), t("verifyItem5")];

  const hasConfirmedBooking = reservations.some(
    (r) => r.listingId === (l?.id ?? "") && (r.status === "Activa" || r.status === "Finalizada" || r.status === "En revisión")
  );

  if (!l) {
    return (
      <PageShell>
        <Navbar />
        <div className="mx-auto max-w-2xl p-10 text-center">
          <p className="text-sm text-[#1F1F1F]/60">{t("notFound")}</p>
          <Link to="/explorar" className="mt-4 inline-block text-[#B08A4A]">{t("backExplore")}</Link>
        </div>
      </PageShell>
    );
  }

  const reserve = () => {
    if (overLimit) { toast.error(`Easy Stay ${language === "es" ? "ofrece estadías de hasta" : "offers stays of up to"} ${MAX_NIGHTS} ${t("nightsCount")}`); return; }
    if (nights <= 0) { toast.error(t("validDatesError")); return; }
    navigate({
      to: "/reservar/$id",
      params: { id: l.id },
      search: { checkIn, checkOut, guests } as never,
    });
  };

  return (
    <PageShell>
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 pt-6">
        <div className="flex items-center gap-2 text-xs text-[#1F1F1F]/60">
          <Link to="/" className="hover:text-[#B08A4A]">{t("breadcrumbHome")}</Link>
          <span>›</span>
          <Link to="/explorar" className="hover:text-[#B08A4A]">{t("breadcrumbExplore")}</Link>
          <span>›</span>
          <span className="text-[#1F1F1F]">{l.name}</span>
        </div>

        {/* Gallery */}
        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2">
          <button onClick={() => setLightbox(0)} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#DCC9A3] md:aspect-auto">
            <img src={l.images[0]} alt={l.name} className="h-full w-full object-cover hover:opacity-95" />
          </button>
          <div className="hidden grid-cols-2 gap-2 md:grid">
            {l.images.slice(1, 5).map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i + 1)}
                className={`relative overflow-hidden bg-[#DCC9A3] ${i === 1 ? "rounded-tr-2xl" : i === 3 ? "rounded-br-2xl" : ""}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover hover:opacity-95" />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setLightbox(0)}
            className="rounded-full border border-[#1F1F1F] bg-white px-4 py-1.5 text-xs font-medium hover:bg-[#F5F1EB]"
          >
            {t("viewAllPhotos")} ({l.images.length})
          </button>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,380px]">
          <div className="min-w-0">
            <h1 className="font-lora text-3xl leading-tight">{l.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#1F1F1F]/70">
              <MapPin className="h-3.5 w-3.5 text-[#B08A4A]" />
              <span className={hasConfirmedBooking ? "" : "select-none blur-sm"}>
                {l.address}
              </span>
              {" "}· {l.district}, {l.city}
            </p>

            <div className="mt-1 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-[#B08A4A] text-[#B08A4A]" />
              <span className="font-medium">{l.rating.toFixed(1)}</span>
              <span className="text-[#1F1F1F]/50">· {l.reviews} {t("reviewsLabel")}</span>
            </div>

            {/* Host */}
            <div className="mt-6 flex items-center gap-3 border-y border-[#E8E0D2] py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B08A4A] text-sm font-medium text-white">
                ES
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("managedBy")}</p>
                <p className="flex items-center gap-1 text-xs text-[#1F1F1F]/60">
                  <BadgeCheck className="h-3 w-3 text-[#B08A4A]" /> {t("certifiedManager")}
                </p>
              </div>
              <CertificationBadge cert={l.cert} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 border-b border-[#E8E0D2] py-6 sm:grid-cols-4">
              <Stat icon={<BedDouble />} label={l.bedrooms === 0 ? t("chipStudio") : `${l.bedrooms} ${language === "es" ? "hab." : "bed."}`} />
              <Stat icon={<Bath />} label={`${l.bathrooms} ${t("bathroomsLabel")}`} />
              <Stat icon={<Maximize2 />} label={`${l.area} m²`} />
              <Stat icon={<Users />} label={`${l.guests} ${t("guestPlural")}`} />
            </div>

            {/* Amenities */}
            <section className="border-b border-[#E8E0D2] py-6">
              <h2 className="font-lora text-xl">{t("offersTitle")}</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {l.features.map((f) => {
                  const Icon = amenityIcons[f] || ShieldCheck;
                  return (
                    <div key={f} className="flex items-center gap-3 text-sm text-[#1F1F1F]/80">
                      <Icon className="h-4 w-4 text-[#B08A4A]" />
                      {featMap[f] ?? f}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Description */}
            <section className="border-b border-[#E8E0D2] py-6">
              <h2 className="font-lora text-xl">{t("aboutTitle")}</h2>
              <p className="mt-3 text-sm leading-[1.8] text-[#1F1F1F]/80">{l.description}</p>
            </section>

            {/* Verified */}
            <section className="border-b border-[#E8E0D2] py-6">
              <h2 className="font-lora text-xl">{t("verifiedTitle")}</h2>
              <p className="mt-1 text-xs text-[#1F1F1F]/60">{t("verifiedSubtitle")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {verifyItems.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-1.5 text-xs">
                    <Check className="h-3 w-3 text-emerald-600" /> {k}
                  </span>
                ))}
              </div>
            </section>

            {/* Video */}
            {l.videoUrl && (
              <section className="border-b border-[#E8E0D2] py-6">
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: '20px', color: '#1F1F1F', marginBottom: '6px' }}>
                  {t("videoTitle")}
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#888', fontSize: '13px', marginBottom: '12px' }}>
                  {t("videoSubtitle")}
                </p>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', border: '0.5px solid #D8C9B8' }}>
                  <iframe
                    src={l.videoUrl}
                    title={t("videoTitle")}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#aaa', fontStyle: 'italic', marginTop: '8px' }}>
                  {t("videoNote")}
                </p>
              </section>
            )}

            {/* Map */}
            <section className="border-b border-[#E8E0D2] py-6">
              <h2 className="font-lora text-xl">{t("locationTitle")}</h2>
              <div className="mt-3 flex items-center gap-2">
                <Pin className="h-4 w-4 flex-shrink-0 text-[#B08A4A]" />
                <span className={`text-sm font-medium text-[#1F1F1F] ${hasConfirmedBooking ? "" : "select-none blur-sm"}`}>
                  {l.address}
                </span>
                <span className="text-sm text-[#1F1F1F]/50">· {l.district}, {l.city}</span>
              </div>
              <div className="relative mt-4 flex h-52 items-center justify-center overflow-hidden rounded-xl border border-[#E8E0D2] bg-[#F5F1EB]">
                <div className={`text-center px-4 ${hasConfirmedBooking ? "" : "blur-sm select-none"}`}>
                  <Pin className="mx-auto h-7 w-7 text-[#B08A4A]" />
                  <p className="mt-2 text-sm font-medium">{l.address}</p>
                  <p className="text-xs text-[#1F1F1F]/50">{l.district}, {l.city}</p>
                  <p className="mt-2 text-[11px] text-[#1F1F1F]/40">{t("locationNote")}</p>
                </div>
                {!hasConfirmedBooking && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow">
                      <Lock className="h-5 w-5 text-[#B08A4A]" />
                    </div>
                    <p className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#1F1F1F]/70 shadow">
                      {language === "es" ? "Dirección disponible tras confirmar reserva" : "Address available after booking confirmation"}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews */}
            <section className="py-6">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 fill-[#B08A4A] text-[#B08A4A]" />
                <span className="font-lora text-2xl">{l.rating.toFixed(1)}</span>
                <span className="text-sm text-[#1F1F1F]/60">· {l.reviews} {t("reviewsLabel")}</span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((r) => (
                  <div key={r.name} className="rounded-xl border border-[#E8E0D2] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCC9A3] text-xs font-medium">
                        {r.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-[10px] text-[#1F1F1F]/50">{r.date}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-[#B08A4A] text-[#B08A4A]" />
                      ))}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#1F1F1F]/70">{r.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Booking panel */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-[#E8E0D2] bg-white p-6">
              <div className="flex items-baseline gap-2">
                <span className="font-lora text-3xl text-[#B08A4A]">{fmtUSD(l.price)}</span>
                <span className="text-xs text-[#1F1F1F]/60">{t("perNight")}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Field label={t("arrival")}>
                  <input type="date" value={checkIn} min={todayPlus(0)} onChange={(e) => setCheckIn(e.target.value)} className="bk-input" />
                </Field>
                <Field label={t("departure")}>
                  <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="bk-input" />
                </Field>
              </div>
              <Field label={t("guests")}>
                <div className="flex items-center justify-between rounded-lg border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-2">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E0D2] hover:border-[#B08A4A]"
                    aria-label={language === "es" ? "Menos" : "Less"}
                  ><Minus className="h-3 w-3" /></button>
                  <span className="text-sm">{guests} {guests > 1 ? t("guestPlural") : t("guestSingular")}</span>
                  <button
                    onClick={() => {
                      if (guests >= 4) { toast.error(t("guestCapacityError")); return; }
                      setGuests(Math.min(4, Math.min(l.guests, guests + 1)));
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E0D2] hover:border-[#B08A4A]"
                    aria-label={language === "es" ? "Más" : "More"}
                  >+</button>
                </div>
              </Field>

              {overLimit && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                  {t("maxNightsError")} {MAX_NIGHTS} {t("maxNightsError2")}
                </p>
              )}

              <div className="mt-5 space-y-2 border-t border-[#E8E0D2] pt-4 text-sm">
                <Row
                  label={`${fmtUSD(l.price)} × ${cost.nights} ${cost.nights === 1 ? t("nightCount") : t("nightsCount")}`}
                  value={fmtUSD(cost.base)}
                />
                <Row label={t("cleaningFee")} value={fmtUSD(cost.cleaning)} />
                <Row label={t("serviceFee")} value={fmtUSD(cost.service)} />
                <Row label={t("igv")} value={fmtUSD(cost.igv)} />
                <div className="flex items-baseline justify-between border-t border-[#E8E0D2] pt-3">
                  <span className="text-sm font-medium">{t("total")}</span>
                  <span className="font-lora text-2xl text-[#B08A4A]">{fmtUSD(cost.total)}</span>
                </div>
              </div>

              <button
                onClick={reserve}
                disabled={overLimit || nights <= 0}
                className="mt-5 block w-full rounded-full bg-[#B08A4A] py-3 text-center text-sm font-medium text-white hover:bg-[#9a7740] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("bookNow")}
              </button>

              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                {t("highDemand")}
              </p>
              <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800">
                {t("freeCancellation")}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5" onClick={() => setLightbox(null)}>
          <button className="absolute right-5 top-5 text-white" onClick={() => setLightbox(null)} aria-label={t("close")}>
            <X className="h-6 w-6" />
          </button>
          <div className="grid max-h-[90vh] max-w-5xl grid-cols-1 gap-3 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {l.images.map((src, i) => (
              <img key={i} src={src} alt="" className="w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .bk-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E8E0D2;
          background: #FAF8F5;
          padding: 0.5rem 0.75rem;
          font-size: 0.8125rem;
          outline: none;
        }
        .bk-input:focus { border-color: #B08A4A; }
      `}</style>
    </PageShell>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[#B08A4A]">{icon}</div>
      <span className="text-sm text-[#1F1F1F]/80">{label}</span>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-2 block">
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#1F1F1F]/60">{label}</span>
      {children}
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#1F1F1F]/70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function MarkInner({ v }: { v: string }) {
  if (v === "yes") return <Check className="h-4 w-4 text-emerald-600" />;
  if (v === "yes-bad") return <span className="text-xs text-red-500">Sí ⚠</span>;
  if (v === "warn") return <span className="text-xs text-amber-600">Varía</span>;
  if (v === "no") return <X className="h-4 w-4 text-red-400" />;
  return <Minus className="h-3 w-3 text-[#1F1F1F]/30" />;
}
function Mark({ v, good }: { v: string; good?: boolean }) {
  return <td className={`px-4 py-3 ${good ? "bg-[#FAF8F5]" : ""}`}><MarkInner v={v} /></td>;
}
