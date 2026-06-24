import { useState } from "react";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";

const items = [
  "Agua, luz, gas e internet",
  "Limpieza quincenal",
  "Mantenimiento de artefactos",
  "Seguro de inmueble",
  "Gestión de incidencias 24/7",
];

export function AllInclusivePanel({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#E8E0D2] bg-[#FAF8F5]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-medium text-[#1F1F1F]">
          <ShieldCheck className="h-4 w-4 text-[#B08A4A]" />
          Todo incluido — ver qué cubre
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#1F1F1F]/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-[#E8E0D2] px-4 py-4">
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it} className="flex items-start gap-2 text-xs text-[#1F1F1F]/80">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#B08A4A]" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

