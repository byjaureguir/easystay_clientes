import { BottomNav } from "./BottomNav";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-[#1F1F1F] lg:pb-0">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
