import { Link, useNavigate } from "@tanstack/react-router";
import { LifeBuoy, Menu, X, ChevronDown, LogOut, User, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { useUI } from "../lib/ui";
import { useLanguage } from "../lib/i18n";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { isLoggedIn, currentUser, logout } = useAuth();
  const { openLock } = useUI();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const initials = (currentUser?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleEmergencies = () => {
    if (isLoggedIn) navigate({ to: "/emergencias" });
    else openLock();
  };

  const handleLogout = () => {
    logout();
    setDropdown(false);
    toast.success("Sesión cerrada");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E0D2] bg-[#FAF8F5]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4">
        <Link to="/" className="font-lora text-xl tracking-[0.18em] text-[#B08A4A]">
          EASY STAY
        </Link>

        <nav className="ml-auto hidden items-center gap-6 text-sm text-[#1F1F1F]/80 md:flex">
          <Link to="/explorar" className="hover:text-[#B08A4A]" activeProps={{ className: "text-[#B08A4A]" }}>
            {t("explore")}
          </Link>
          <button onClick={handleEmergencies} className="flex items-center gap-1.5 hover:text-[#B08A4A]">
            <LifeBuoy className="h-3.5 w-3.5" /> {t("emergencies")}
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <div className="flex overflow-hidden rounded-full border border-[#B08A4A] text-[11px] font-semibold">
            <button
              onClick={() => setLanguage("es")}
              aria-label="Español"
              className={`px-2.5 py-1 transition-colors ${language === "es" ? "bg-[#B08A4A] text-white" : "text-[#B08A4A] hover:bg-[#B08A4A]/10"}`}
            >
              ES
            </button>
            <span className="w-px self-stretch bg-[#B08A4A]/40" />
            <button
              onClick={() => setLanguage("en")}
              aria-label="English"
              className={`px-2.5 py-1 transition-colors ${language === "en" ? "bg-[#B08A4A] text-white" : "text-[#B08A4A] hover:bg-[#B08A4A]/10"}`}
            >
              EN
            </button>
          </div>

          {isLoggedIn ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdown((d) => !d)}
                className="flex items-center gap-2 rounded-full bg-[#B08A4A] px-2 py-1.5 text-xs font-medium text-white"
              >
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/20">
                  {currentUser?.photo ? <img src={currentUser.photo} alt="" className="h-full w-full object-cover" /> : initials}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {dropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdown(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-[#E8E0D2] bg-white shadow-lg">
                    <Link to="/cuenta" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#F5F1EB]">
                      <User className="h-3.5 w-3.5 text-[#B08A4A]" /> {t("myAccount")}
                    </Link>
                    <Link to="/cuenta" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#F5F1EB]">
                      <Calendar className="h-3.5 w-3.5 text-[#B08A4A]" /> {t("myBookings")}
                    </Link>
                    <button onClick={() => { setDropdown(false); handleEmergencies(); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-[#F5F1EB]">
                      <LifeBuoy className="h-3.5 w-3.5 text-[#B08A4A]" /> {t("emergencies")}
                    </button>
                    <div className="border-t border-[#E8E0D2]" />
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-3.5 w-3.5" /> {t("signOut")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full border border-[#B08A4A] px-4 py-1.5 text-xs font-medium text-[#B08A4A] hover:bg-[#B08A4A] hover:text-white md:inline-flex"
            >
              {t("signIn")}
            </Link>
          )}

          <button
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {open && (
        <div className="border-t border-[#E8E0D2] bg-[#FAF8F5] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/explorar" onClick={() => setOpen(false)} className="py-1.5">{t("explore")}</Link>
            <button onClick={() => { setOpen(false); handleEmergencies(); }} className="py-1.5 text-left">{t("emergencies247")}</button>
            <div className="flex w-fit overflow-hidden rounded-full border border-[#B08A4A] text-[11px] font-semibold">
              <button onClick={() => setLanguage("es")} className={`px-2.5 py-1 transition-colors ${language === "es" ? "bg-[#B08A4A] text-white" : "text-[#B08A4A]"}`}>ES</button>
              <span className="w-px self-stretch bg-[#B08A4A]/40" />
              <button onClick={() => setLanguage("en")} className={`px-2.5 py-1 transition-colors ${language === "en" ? "bg-[#B08A4A] text-white" : "text-[#B08A4A]"}`}>EN</button>
            </div>

            {isLoggedIn ? (
              <>
                <Link to="/cuenta" onClick={() => setOpen(false)} className="py-1.5">{t("myAccount")}</Link>
                <button onClick={() => { setOpen(false); handleLogout(); }} className="py-1.5 text-left text-red-600">{t("signOut")}</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="py-1.5">Ingresar</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
