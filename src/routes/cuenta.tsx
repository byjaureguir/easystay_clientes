import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck, Sparkles, Package,
  Calendar, CreditCard, Headphones, Settings, Download, Plus, LogOut, Compass, MapPin,
} from "lucide-react";
import { getListing } from "../lib/listings";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "../components/PageShell";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";
import { EditProfileModal } from "../components/EditProfileModal";

export const Route = createFileRoute("/cuenta")({
  component: Cuenta,
});

type Tab = "reservas" | "pagos" | "soporte" | "config";

function Cuenta() {
  const [tab, setTab] = useState<Tab>("reservas");
  const [editOpen, setEditOpen] = useState(false);
  const { isLoggedIn, currentUser, reservations: userReservations, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/login" });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !currentUser) {
    return (
      <PageShell><Navbar />
        <div className="mx-auto max-w-md px-5 py-20 text-center">
          <p className="text-sm text-[#1F1F1F]/60">{t("redirectingLogin")}</p>
        </div>
      </PageShell>
    );
  }

  const userInitials = currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const hasReservations = userReservations.length > 0;
  const activeReservation = userReservations.find((r) => r.status === "Activa");
  const activeCount = userReservations.filter((r) => r.status === "Activa").length;
  const totalNights = userReservations.reduce((s, r) => s + r.nights, 0);

  const tickets = [
    { id: "T-1042", title: t("emergCard6Title"), status: t("ticketInProcess"), date: "Hoy" },
    { id: "T-1038", title: "WiFi", status: t("ticketResolved"), date: "Hace 3 días" },
  ];

  return (
    <PageShell>
      <Navbar />

      <div className="mx-auto max-w-5xl px-5 pt-8">
        {/* Profile */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#B08A4A] font-lora text-2xl text-white">
            {currentUser.photo ? (
              <img src={currentUser.photo} alt={currentUser.name} className="h-full w-full object-cover" />
            ) : (
              userInitials
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-lora text-2xl">{currentUser.name}</h1>
            <p className="text-xs text-[#1F1F1F]/60">{currentUser.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <BadgeCheck className="h-3 w-3" /> {t("identityVerified")}
            </span>
          </div>
          <button onClick={() => setEditOpen(true)} className="text-sm text-[#B08A4A] hover:underline">
            {t("editProfile")}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: t("activeBookings"), value: String(activeCount) },
            { label: t("nightsBooked"), value: String(totalNights) },
            { label: t("openTickets"), value: "0" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#E8E0D2] bg-white p-5">
              <p className="text-xs text-[#1F1F1F]/60">{s.label}</p>
              <p className="mt-1 font-lora text-3xl text-[#B08A4A]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Current stay */}
        {activeReservation && (
          <div className="mt-6 rounded-2xl border border-[#E8E0D2] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#B08A4A]">{t("currentStay")}</p>
                <h3 className="mt-1 font-lora text-xl">{activeReservation.listingName} · {activeReservation.district}</h3>
                {getListing(activeReservation.listingId)?.address && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#B08A4A]">
                    <MapPin className="h-3 w-3" />
                    {getListing(activeReservation.listingId)!.address}, {activeReservation.district}, {getListing(activeReservation.listingId)!.city}
                  </p>
                )}
                <p className="mt-1 text-xs text-[#1F1F1F]/60">
                  {activeReservation.nights} {activeReservation.nights !== 1 ? t("nightsSuffixPlural") : t("nightsSuffix")} · {t("departure").toLowerCase()} {activeReservation.checkOut}
                </p>
              </div>
              <Link to="/property/$id" params={{ id: activeReservation.listingId }} className="text-sm text-[#B08A4A] hover:underline">
                {t("viewDetailArrow")}
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                { k: t("nightsBooked"), v: String(activeReservation.nights) },
                { k: t("stayCheckin"), v: activeReservation.checkIn },
                { k: t("stayTotal"), v: `$${activeReservation.total.toLocaleString()} USD` },
                { k: t("statusLabel"), v: activeReservation.status },
              ].map((x) => (
                <div key={x.k} className="rounded-xl bg-[#F5F1EB] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#1F1F1F]/50">{x.k}</p>
                  <p className="mt-1 text-sm font-medium">{x.v}</p>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="mt-6 border-t border-[#E8E0D2] pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F1F1F]/50">{t("timeline")}</h4>
              <ol className="mt-3 space-y-3">
                {[
                  { label: t("timelineCreated"), date: activeReservation.createdAt.slice(0, 10), icon: Package },
                  { label: t("timelineArrival"), date: activeReservation.checkIn, icon: Calendar },
                  { label: t("timelineDeparture"), date: activeReservation.checkOut, icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8F5] text-[#B08A4A]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">{item.label}</div>
                      <span className="text-xs text-[#1F1F1F]/50">{item.date}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-10 border-b border-[#E8E0D2]">
          <div className="flex gap-1 overflow-x-auto">
            {([
              { id: "reservas", label: t("tabBookings"), icon: Calendar },
              { id: "pagos", label: t("tabPayments"), icon: CreditCard },
              { id: "soporte", label: t("tabSupport"), icon: Headphones },
              { id: "config", label: t("tabSettings"), icon: Settings },
            ] as { id: Tab; label: string; icon: typeof Calendar }[]).map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
                    active ? "border-[#B08A4A] text-[#B08A4A]" : "border-transparent text-[#1F1F1F]/60 hover:text-[#1F1F1F]"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-6">
          {/* MIS RESERVAS */}
          {tab === "reservas" && (
            !hasReservations ? (
              <div className="rounded-2xl border border-dashed border-[#E8E0D2] p-10 text-center">
                <Calendar className="mx-auto h-10 w-10 text-[#B08A4A]" strokeWidth={1} />
                <p className="mt-4 font-lora text-lg text-[#1F1F1F]">{t("noBookings")}</p>
                <p className="mt-2 text-sm text-[#888]">{t("noBookingsBody")}</p>
                <Link to="/explorar" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#B08A4A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]">
                  <Compass className="h-4 w-4" /> {t("exploreProperties")}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userReservations.map((r) => {
                  const color = r.status === "Activa"
                    ? "bg-emerald-50 text-emerald-700"
                    : r.status === "En revisión"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-[#F5F1EB] text-[#1F1F1F]/60";
                  return (
                    <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#E8E0D2] bg-white p-4">
                      <img src={r.image} alt={r.listingName} className="h-20 w-20 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-lora text-base">{r.listingName}</h4>
                        {getListing(r.listingId)?.address && (
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#B08A4A]">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {getListing(r.listingId)!.address}, {r.district}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs text-[#1F1F1F]/60">
                          {r.checkIn} — {r.checkOut} · {r.nights} {r.nights !== 1 ? t("nightsSuffixPlural") : t("nightsSuffix")} · ${r.total.toLocaleString()} USD
                        </p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${color}`}>
                          {r.status} · #{r.code}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/property/$id" params={{ id: r.listingId }} className="rounded-full border border-[#E8E0D2] px-3 py-1.5 text-xs hover:border-[#B08A4A] hover:text-[#B08A4A]">
                          {t("viewDetail")}
                        </Link>
                        <button onClick={() => toast(t("connectingSupport"))} className="rounded-full bg-[#B08A4A] px-3 py-1.5 text-xs text-white hover:bg-[#9a7740]">
                          {t("contactSupport")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* PAGOS */}
          {tab === "pagos" && (
            !hasReservations ? (
              <div className="rounded-2xl border border-dashed border-[#E8E0D2] p-10 text-center">
                <CreditCard className="mx-auto h-10 w-10 text-[#B08A4A]" strokeWidth={1} />
                <p className="mt-4 font-lora text-lg text-[#1F1F1F]">{t("noPayments")}</p>
                <p className="mt-2 text-sm text-[#888]">{t("noPaymentsBody")}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E8E0D2]">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F1EB] text-left text-xs text-[#1F1F1F]/60">
                    <tr>
                      <th className="px-4 py-3 font-medium">{t("tableDate")}</th>
                      <th className="px-4 py-3 font-medium">{t("tableConcept")}</th>
                      <th className="px-4 py-3 font-medium">{t("tableAmount")}</th>
                      <th className="px-4 py-3 font-medium">{t("statusLabel")}</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D2] bg-white">
                    {userReservations.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3 text-[#1F1F1F]/70">{r.createdAt.slice(0, 10)}</td>
                        <td className="px-4 py-3">{r.listingName} · {r.nights} {r.nights !== 1 ? t("nightsSuffixPlural") : t("nightsSuffix")}</td>
                        <td className="px-4 py-3 font-medium">${r.total.toLocaleString()} USD</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${r.status === "Activa" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {r.status === "Finalizada" ? t("paymentPaid") : t("paymentReview")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toast.success(t("receiptDownloaded"))} className="flex items-center gap-1 text-xs text-[#B08A4A] hover:underline">
                            <Download className="h-3 w-3" /> {t("receiptLabel")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* SOPORTE */}
          {tab === "soporte" && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-lora text-lg">{t("supportTicketsTitle")}</h3>
                <button onClick={() => toast.success(t("ticketCreated"))} className="flex items-center gap-2 rounded-full bg-[#B08A4A] px-4 py-2 text-xs font-medium text-white hover:bg-[#9a7740]">
                  <Plus className="h-3.5 w-3.5" /> {t("newTicket")}
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {tickets.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#E8E0D2] bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-[#1F1F1F]/60">{item.id} · {item.date}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.status === t("ticketResolved") ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONFIG */}
          {tab === "config" && (
            <form
              onSubmit={(e) => { e.preventDefault(); toast.success(t("configSaved")); }}
              className="max-w-lg space-y-4"
            >
              <Field label={t("nameLabel")}><input defaultValue={currentUser.name} className="cfg-input" /></Field>
              <Field label={t("emailLabel")}><input defaultValue={currentUser.email} className="cfg-input" /></Field>
              <Field label={t("phoneLabel")}><input defaultValue={currentUser.phone || ""} className="cfg-input" /></Field>
              <Field label={t("newPassword")}><input type="password" placeholder="••••••••" className="cfg-input" /></Field>

              <div className="rounded-xl border border-[#E8E0D2] bg-white p-4">
                <p className="text-sm font-medium">{t("notificationsTitle")}</p>
                {[t("notifPayments"), t("notifMaintenance"), t("notifPromotions")].map((n) => (
                  <label key={n} className="mt-3 flex items-center justify-between text-sm">
                    <span>{n}</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-full bg-[#B08A4A] py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]">
                  {t("saveChanges")}
                </button>
                <button
                  type="button"
                  onClick={() => { logout(); toast.success(t("signOut")); navigate({ to: "/" }); }}
                  className="flex items-center gap-1 rounded-full border border-[#E8E0D2] px-4 py-2.5 text-sm hover:bg-[#F5F1EB]"
                >
                  <LogOut className="h-3.5 w-3.5" /> {t("signOut")}
                </button>
              </div>

              <style>{`
                .cfg-input {
                  width: 100%;
                  border-radius: 0.5rem;
                  border: 1px solid #E8E0D2;
                  background: #FAF8F5;
                  padding: 0.625rem 1rem;
                  font-size: 0.875rem;
                  outline: none;
                }
                .cfg-input:focus { border-color: #B08A4A; }
              `}</style>
            </form>
          )}
        </div>
      </div>

      <Footer />
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#1F1F1F]/70">{label}</span>
      {children}
    </label>
  );
}
