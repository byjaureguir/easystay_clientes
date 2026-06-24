import { createContext, useContext, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, X, Compass, LogIn, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "./auth";

type UIState = {
  openLock: () => void;
  openSupport: () => void;
  openTerms: () => void;
};

const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [lock, setLock] = useState(false);
  const [support, setSupport] = useState(false);
  const [terms, setTerms] = useState(false);
  const [cat, setCat] = useState("Mantenimiento");
  const [desc, setDesc] = useState("");

  const submitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      toast.error("Describe el problema");
      return;
    }
    toast.success("Tu solicitud fue recibida. Te contactamos en menos de 15 minutos.");
    setDesc("");
    setSupport(false);
  };

  return (
    <Ctx.Provider
      value={{
        openLock: () => setLock(true),
        openSupport: () => (isLoggedIn ? setSupport(true) : setLock(true)),
        openTerms: () => setTerms(true),
      }}
    >
      {children}

      {/* Floating support button — visible on all pages */}
      <button
        onClick={() => (isLoggedIn ? setSupport(true) : setLock(true))}
        className="fixed bottom-20 right-5 z-30 flex items-center gap-2 rounded-full bg-[#B08A4A] px-4 py-3 text-xs font-medium text-white shadow-lg shadow-black/20 hover:bg-[#9a7740] md:bottom-5"
      >
        <HelpCircle className="h-4 w-4" /> Solicitar atención
      </button>

      {/* Lock modal */}
      {lock && (
        <Modal onClose={() => setLock(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F1EB]">
              <Lock className="h-6 w-6 text-[#B08A4A]" />
            </div>
            <h3 className="mt-4 font-lora text-2xl">Acceso exclusivo para huéspedes</h3>
            <p className="mt-3 text-sm text-[#1F1F1F]/70">
              Para acceder necesitas tener una reserva activa. Inicia sesión o
              crea tu cuenta al momento de reservar.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setLock(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B08A4A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
              >
                <LogIn className="h-4 w-4" /> Iniciar sesión
              </Link>
              <Link
                to="/explorar"
                onClick={() => setLock(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#B08A4A] px-5 py-2.5 text-sm font-medium text-[#B08A4A] hover:bg-[#F5F1EB]"
              >
                <Compass className="h-4 w-4" /> Explorar inmuebles
              </Link>
            </div>
          </div>
        </Modal>
      )}

      {/* Support modal */}
      {support && (
        <Modal onClose={() => setSupport(false)}>
          <h3 className="font-lora text-xl">Solicitar atención</h3>
          <p className="mt-1 text-sm text-[#1F1F1F]/60">
            Cuéntanos qué necesitas. Nuestro equipo te contactará pronto.
          </p>
          <form onSubmit={submitSupport} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#1F1F1F]/70">Categoría</span>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full rounded-lg border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-2 text-sm outline-none focus:border-[#B08A4A]"
              >
                <option>Mantenimiento</option>
                <option>Limpieza</option>
                <option>Seguridad</option>
                <option>Conectividad</option>
                <option>Otro</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#1F1F1F]/70">Descripción</span>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="¿Qué ocurre?"
                className="w-full resize-none rounded-lg border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-2 text-sm outline-none focus:border-[#B08A4A]"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-[#B08A4A] py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
            >
              Enviar solicitud
            </button>
          </form>
        </Modal>
      )}

      {/* Terms modal */}
      {terms && (
        <Modal onClose={() => setTerms(false)}>
          <h3 className="font-lora text-xl">Términos y políticas</h3>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#1F1F1F]/80">
            <p>
              <b>Cancelación gratuita</b> hasta 48 horas antes de la llegada. Después de
              ese plazo, se cobra 1 noche como penalidad.
            </p>
            <p>
              Easy Stay se reserva el derecho de cancelar reservas que incumplan las
              normas de convivencia.
            </p>
            <p>
              Los servicios incluidos (agua, luz, gas, wifi, limpieza quincenal) están
              cubiertos por la tarifa. El depósito de 1 noche es reembolsable al finalizar la estadía.
            </p>
          </div>
          <button
            onClick={() => setTerms(false)}
            className="mt-5 w-full rounded-full bg-[#B08A4A] py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
          >
            Entendido
          </button>
        </Modal>
      )}
    </Ctx.Provider>
  );
}

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI must be used within UIProvider");
  return c;
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
