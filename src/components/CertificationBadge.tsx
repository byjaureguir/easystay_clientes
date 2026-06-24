import { Award } from "lucide-react";
import type { CertScores } from "../lib/listings";

const labels: Record<keyof CertScores, string> = {
  limpieza: "Limpieza",
  equipamiento: "Equipamiento",
  conectividad: "Conectividad",
  seguridad: "Seguridad",
  confort: "Confort",
};

export function CertificationBadge({ cert, full = false }: { cert: CertScores; full?: boolean }) {
  if (!full) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#B08A4A]/40 bg-[#FAF8F5] px-2.5 py-1 text-[10px] font-medium text-[#B08A4A]">
        <Award className="h-3 w-3" /> Certificado Easy Stay Premium
      </span>
    );
  }
  return (
    <div className="rounded-xl border border-[#E8E0D2] bg-[#FAF8F5] p-5">
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-[#B08A4A]" />
        <h3 className="font-lora text-base">Certificación Easy Stay Premium</h3>
      </div>
      <p className="mt-1 text-xs text-[#1F1F1F]/60">
        Cada inmueble es inspeccionado por nuestro equipo según 5 criterios.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(Object.keys(labels) as (keyof CertScores)[]).map((k) => (
          <div key={k}>
            <div className="flex justify-between text-xs">
              <span className="text-[#1F1F1F]/80">{labels[k]}</span>
              <span className="font-medium text-[#B08A4A]">{cert[k].toFixed(1)}/10</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#E8E0D2]">
              <div
                className="h-full bg-[#B08A4A]"
                style={{ width: `${(cert[k] / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
