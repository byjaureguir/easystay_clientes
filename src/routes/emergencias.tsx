import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Phone, AlertTriangle, Flame, Droplet, Zap, Wrench, Home, Key, Heart, Upload, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "../components/PageShell";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";

export const Route = createFileRoute("/emergencias")({
  component: Emergencias,
});

function Emergencias() {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { isLoggedIn, currentUser, reservations } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cat, setCat] = useState(t("emergCatMaintenance"));

  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/login" });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !currentUser) {
    return (
      <PageShell><Navbar />
        <div className="mx-auto max-w-md px-5 py-20 text-center text-sm text-[#1F1F1F]/60">
          {t("redirectingLogin")}
        </div>
      </PageShell>
    );
  }

  const publicCards = [
    { icon: Flame, title: "Bomberos", number: "116", desc: t("emergPubDesc1") },
    { icon: Heart, title: "SAMU", number: "106", desc: t("emergPubDesc2") },
    { icon: Shield, title: "Policía Nacional del Perú", number: "105", desc: t("emergPubDesc3") },
    { icon: Zap, title: "Enel", number: "517-1717", desc: t("emergPubDesc4") },
  ];

  const cards = [
    { icon: Flame, color: "text-red-600", title: t("emergCard1Title"), desc: t("emergCard1Desc"), action: t("emergCard1Action"), number: "116" },
    { icon: Droplet, color: "text-blue-600", title: t("emergCard2Title"), desc: t("emergCard2Desc"), action: t("emergCard2Action"), number: "01-614-9000" },
    { icon: Zap, color: "text-amber-600", title: t("emergCard3Title"), desc: t("emergCard3Desc"), action: t("emergCard3Action"), number: "517-1717" },
    { icon: Droplet, color: "text-cyan-600", title: t("emergCard4Title"), desc: t("emergCard4Desc"), action: t("emergCard4Action"), number: "+51 900 000 000" },
    { icon: Home, color: "text-orange-700", title: t("emergCard5Title"), desc: t("emergCard5Desc"), action: t("emergCard5Action") },
    { icon: Wrench, color: "text-[#B08A4A]", title: t("emergCard6Title"), desc: t("emergCard6Desc"), action: t("emergCard6Action") },
    { icon: Key, color: "text-purple-600", title: t("emergCard7Title"), desc: t("emergCard7Desc"), action: t("emergCard7Action") },
    { icon: Heart, color: "text-red-600", title: t("emergCard8Title"), desc: t("emergCard8Desc"), action: t("emergCard8Action"), number: "106" },
  ];

  const activeRes = reservations.find((r) => r.status === "Activa") || reservations[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) { toast.error(t("emergDescError")); return; }
    toast.success(t("emergTicketSuccess"));
    setDesc(""); setFile(null);
  };

  const cleanNumber = (n: string) => n.replace(/[^0-9]/g, "");

  return (
    <PageShell>
      <Navbar />

      {/* Banner */}
      <div className="bg-red-600 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">{t("emergBannerLine")}</span>
          </div>
          <a href="tel:+51900000000" className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
            <Phone className="h-3.5 w-3.5" /> {t("emergCallNow")}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="font-lora text-3xl">
          Hola, {currentUser.name.split(" ")[0]}. {t("emergHello")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#1F1F1F]/70">
          {t("emergSubtitle")}
        </p>

        {activeRes && (
          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-[#B08A4A]/30 bg-[#FAF8F5] p-4">
            <img src={activeRes.image} alt={activeRes.listingName} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#B08A4A]">{t("emergActiveBooking")}</p>
              <p className="font-lora text-base">{activeRes.listingName}</p>
              <p className="text-xs text-[#1F1F1F]/60">{activeRes.checkIn} → {activeRes.checkOut}</p>
            </div>
          </div>
        )}

        {/* Public emergency services */}
        <div className="mt-10">
          <h2 className="font-lora text-2xl text-[#B08A4A]">{t("emergPublicTitle")}</h2>
          <p className="mt-1 text-sm text-[#1F1F1F]/60">{t("emergPublicSubtitle")}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {publicCards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl border border-[#E8E0D2] bg-white p-5 transition-colors hover:border-[#B08A4A]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-lora text-lg">{c.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#1F1F1F]/70">{c.desc}</p>
                      <a
                        href={`tel:${cleanNumber(c.number)}`}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#B08A4A] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#9a7740]"
                      >
                        <Phone className="h-3 w-3" /> {t("emergCallPrefix")} {c.number}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 border-t border-[#D8C9B8]" />

        {/* Easy Stay emergency cards */}
        <div className="mt-10">
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl border border-[#E8E0D2] bg-white p-5 transition-colors hover:border-[#B08A4A]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#F5F1EB]">
                      <Icon className={`h-5 w-5 ${c.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-lora text-lg">{c.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#1F1F1F]/70">{c.desc}</p>
                      {c.number ? (
                        <a
                          href={`tel:${cleanNumber(c.number)}`}
                          onClick={() => toast.success(`${t("emergCallingPrefix")} ${c.number}...`)}
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#B08A4A] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#9a7740]"
                        >
                          <Phone className="h-3 w-3" /> {c.action}
                        </a>
                      ) : (
                        <button
                          onClick={() => toast.success(`${c.action} — ${t("emergAgentContact")}`)}
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#B08A4A] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#9a7740]"
                        >
                          <Phone className="h-3 w-3" /> {c.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket form */}
        <div className="mt-10 rounded-2xl border border-[#E8E0D2] bg-white p-6">
          <h2 className="font-lora text-xl">{t("emergTicketTitle")}</h2>
          <p className="mt-1 text-sm text-[#1F1F1F]/60">{t("emergTicketSubtitle")}</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#1F1F1F]/70">{t("emergCategoryLabel")}</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="em-input">
                <option>{t("emergCatMaintenance")}</option>
                <option>{t("emergCatCleaning")}</option>
                <option>{t("emergCatSecurity")}</option>
                <option>{t("emergCatConnectivity")}</option>
                <option>{t("emergCatOther")}</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[#1F1F1F]/70">{t("emergDescLabel")}</span>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder={t("emergDescPlaceholder")}
                className="em-input resize-none"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#E8E0D2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1F1F1F]/70 hover:border-[#B08A4A]">
              <Upload className="h-4 w-4 text-[#B08A4A]" />
              <span>{file ? file.name : t("emergAttachPhoto")}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <button type="submit" className="w-full rounded-full bg-[#B08A4A] py-3 text-sm font-medium text-white hover:bg-[#9a7740]">
              {t("emergSubmitTicket")}
            </button>
          </form>
        </div>
      </div>

      <Footer />

      <style>{`
        .em-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E8E0D2;
          background: #FAF8F5;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .em-input:focus { border-color: #B08A4A; }
      `}</style>
    </PageShell>
  );
}
