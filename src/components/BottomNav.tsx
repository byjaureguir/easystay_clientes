import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, LifeBuoy, User } from "lucide-react";

const items = [
  { to: "/" as const, label: "Inicio", icon: Home, match: (p: string) => p === "/" },
  { to: "/explorar" as const, label: "Explorar", icon: Compass, match: (p: string) => p.startsWith("/explorar") || p.startsWith("/property") || p.startsWith("/reservar") },
  { to: "/emergencias" as const, label: "Emergencias", icon: LifeBuoy, match: (p: string) => p.startsWith("/emergencias") },
  { to: "/cuenta" as const, label: "Mi cuenta", icon: User, match: (p: string) => p.startsWith("/cuenta") },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8E0D2] bg-[#FAF8F5]/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
        {items.map((it, i) => {
          const Active = it.match(pathname);
          const Icon = it.icon;
          return (
            <Link
              key={i}
              to={it.to}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors ${
                Active ? "text-[#B08A4A]" : "text-[#1F1F1F]/60 hover:text-[#1F1F1F]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.6} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
