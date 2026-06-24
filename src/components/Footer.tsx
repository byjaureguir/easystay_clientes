import { Link, useNavigate } from "@tanstack/react-router";
import { Phone, X } from "lucide-react";
import { toast } from "sonner";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useUI } from "@/lib/ui";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { isLoggedIn } = useAuth();
  const { openLock } = useUI();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [modal, setModal] = useState<string | null>(null);

  const goAccount = () => navigate({ to: isLoggedIn ? "/cuenta" : "/login" });
  const goEmergencias = () => {
    if (isLoggedIn) navigate({ to: "/emergencias" });
    else openLock();
  };

  const MODALS = {
    help: {
      title: t("helpCenter"),
      body: "¿Tienes alguna pregunta? Escríbenos a hola@easystay.pe o llámanos al +51 900 000 000. Horario de atención: lunes a domingo, 9am a 6pm. Para emergencias fuera de horario llama directamente al número de emergencias 24/7.",
    },
    about: {
      title: t("footerAboutUs"),
      body: "Easy Stay nació con la misión de transformar la experiencia de alojamiento temporal en Lima. Gestionamos cada inmueble directamente para garantizar estándares premium en cada estadía. Sin intermediarios, sin sorpresas.",
    },
    careers: {
      title: t("footerCareers"),
      body: "Estamos siempre buscando personas apasionadas por el servicio al cliente y la hospitalidad. Envía tu CV a: careers@easystay.pe",
    },
    press: {
      title: t("footerPress"),
      body: "Para consultas de medios y solicitudes de entrevistas, contáctanos en: prensa@easystay.pe",
    },
  };

  const company = [
    { label: t("footerAboutUs"), to: "/" as const },
    { label: t("footerCareers"), key: "careers" as const },
    { label: t("footerPress"), key: "press" as const },
    { label: t("footerTerms"), to: "/terminos" as const },
    { label: t("footerPrivacy"), to: "/privacidad" as const },
  ];

  return (
    <footer className="border-t border-[#E8E0D2] bg-[#1F1F1F] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-4">
        <div>
          <p className="font-lora text-lg tracking-[0.22em] text-[#DCC9A3]">EASY STAY</p>
          <p className="mt-3 text-xs leading-relaxed text-white/60">{t("footerTagline")}</p>
        </div>

        <div>
          <h4 className="font-lora text-sm text-white">{t("footerExploreLabel")}</h4>
          <ul className="mt-3 space-y-2 text-xs text-white/60">
            <li><Link to="/explorar" className="hover:text-[#DCC9A3]">{t("footerViewListings")}</Link></li>
            <li><button onClick={goAccount} className="hover:text-[#DCC9A3]">{t("myAccount")}</button></li>
            <li><button onClick={goEmergencias} className="hover:text-[#DCC9A3]">{t("emergencies247")}</button></li>
            <li><button onClick={() => setModal("help")} className="hover:text-[#DCC9A3]">{t("helpCenter")}</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-lora text-sm text-white">{t("company")}</h4>
          <ul className="mt-3 space-y-2 text-xs text-white/60">
            {company.map((l) => (
              <li key={l.label}>
                {"to" in l ? (
                  <Link to={l.to} className="hover:text-[#DCC9A3]">{l.label}</Link>
                ) : (
                  <button onClick={() => l.key && setModal(l.key)} className="hover:text-[#DCC9A3]">{l.label}</button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-lora text-sm text-white">{t("contact")}</h4>
          <a
            href="tel:+51900000000"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#B08A4A]/15 px-3 py-1.5 text-xs font-medium text-[#DCC9A3] hover:bg-[#B08A4A]/25"
          >
            <Phone className="h-3 w-3" /> {t("footerEmergenciesLine")}
          </a>
          <p className="mt-3 text-xs text-white/60">
            <a href="mailto:hola@easystay.pe" className="hover:text-[#DCC9A3]">hola@easystay.pe</a>
          </p>
          <p className="mt-1 text-xs text-white/60">{t("footerCity")}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-white/50">
          <span>{t("footerLegal")}</span>
        </div>
      </div>

      {modal && MODALS[modal as keyof typeof MODALS] && (
        <FooterModal onClose={() => setModal(null)}>
          <h3 className="font-lora text-2xl text-[#1F1F1F]">{MODALS[modal as keyof typeof MODALS].title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-[#1F1F1F]/75">{MODALS[modal as keyof typeof MODALS].body}</p>
          <button
            onClick={() => setModal(null)}
            className="mt-6 w-full rounded-full bg-[#B08A4A] py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
          >
            {t("close")}
          </button>
        </FooterModal>
      )}
    </footer>
  );
}

function FooterModal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#1F1F1F]/60 hover:bg-[#F5F1EB] hover:text-[#1F1F1F]"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
