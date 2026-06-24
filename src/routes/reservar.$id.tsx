import { createFileRoute, Link, useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ShieldCheck, FileText, CheckCircle2, CreditCard, Lock, Eye, EyeOff, Loader2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { getListing, nightsBetween, computeCost, fmtUSD, MAX_NIGHTS } from "../lib/listings";
import { PageShell } from "../components/PageShell";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";

const EMAILJS_SERVICE = "service_1glkxob";
const EMAILJS_TEMPLATE = "template_fqk233d";
const EMAILJS_PUBLIC_KEY = "7pc37v47UVErAj7Oy";

type ReservarSearch = { checkIn?: string; checkOut?: string; guests?: number };

export const Route = createFileRoute("/reservar/$id")({
  validateSearch: (s: Record<string, unknown>): ReservarSearch => ({
    checkIn: typeof s.checkIn === "string" ? s.checkIn : undefined,
    checkOut: typeof s.checkOut === "string" ? s.checkOut : undefined,
    guests: typeof s.guests === "number" ? s.guests : Number(s.guests) || undefined,
  }),
  component: Reservar,
});

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function Reservar() {
  const { id } = useParams({ from: "/reservar/$id" });
  const search = useSearch({ from: "/reservar/$id" }) as ReservarSearch;
  const l = getListing(id);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isLoggedIn, currentUser, register, loginWithCredentials, addReservation } = useAuth();

  const [step, setStep] = useState(isLoggedIn ? 1 : 0);
  const [code] = useState(() => `ES-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [processing, setProcessing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [account, setAccount] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [form, setForm] = useState({
    checkIn: search.checkIn || todayPlus(7),
    checkOut: search.checkOut || todayPlus(14),
    guests: Math.min(search.guests || 1, 4),
    docType: "DNI" as "DNI" | "Pasaporte",
    doc: "",
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    reason: "Turismo",
    emergencyName: "",
    emergencyPhone: "",
    terms: false,
  });

  const [pay, setPay] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card");

  const sendConfirmationEmail = (method: "Tarjeta de crédito" | "PayPal") => {
    const params = {
      to_email: form.email,
      to_name: form.name,
      booking_code: code,
      property_name: l!.name,
      property_address: l!.address,
      property_district: l!.district,
      property_city: l!.city,
      property_area: String(l!.area),
      property_bedrooms: l!.bedrooms === 0 ? "Estudio" : String(l!.bedrooms),
      property_image: l!.images[0],
      check_in: form.checkIn,
      check_out: form.checkOut,
      nights: String(cost.nights),
      guests: String(form.guests),
      guest_name: form.name,
      guest_email: form.email,
      guest_phone: form.phone,
      guest_doc_type: form.docType,
      guest_doc: form.doc,
      reason_for_stay: form.reason,
      emergency_name: form.emergencyName,
      emergency_phone: form.emergencyPhone,
      payment_method: method,
      price_per_night: fmtUSD(l!.price),
      base_price: fmtUSD(cost.base),
      cleaning_fee: fmtUSD(cost.cleaning),
      service_fee: fmtUSD(cost.service),
      igv: fmtUSD(cost.igv),
      total: fmtUSD(cost.total),
      from_name: "Easy Stay",
      reply_to: "by.jaureguir@alum.up.edu.pe",
    };
    emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params, EMAILJS_PUBLIC_KEY).catch(() => {
      // Email sending failure is silent — booking is already confirmed
    });
  };

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const overLimit = nights > MAX_NIGHTS;
  const cost = useMemo(() => computeCost(l?.price ?? 0, overLimit ? 0 : nights), [l?.price, nights, overLimit]);

  const STEPS = [t("stepAccount"), t("stepData"), t("stepReview"), t("stepPayment"), t("stepConfirm")];

  const cardType = (() => {
    const n = pay.number.replace(/\s/g, "");
    if (n.startsWith("4")) return "Visa";
    if (n.startsWith("5")) return "Mastercard";
    return null;
  })();

  if (!l) {
    return (
      <PageShell>
        <Navbar />
        <div className="p-10 text-center text-sm">{t("notFound")}</div>
      </PageShell>
    );
  }

  // Step 0
  const submitAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.name.trim()) return toast.error(t("errNameRequired"));
    if (!account.email.includes("@")) return toast.error(t("errEmailInvalid"));
    if (!account.phone.trim()) return toast.error(t("errPhoneRequired"));
    if (account.password.length < 8) return toast.error(t("errPasswordMin"));
    if (account.password !== account.confirm) return toast.error(t("errPasswordMatch"));
    register({ name: account.name, email: account.email, phone: account.phone, password: account.password });
    setForm((f) => ({ ...f, name: account.name, email: account.email, phone: account.phone }));
    toast.success(t("accountCreatedSuccess"));
    setStep(1);
  };

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginWithCredentials(loginEmail, loginPwd)) {
      toast.success(t("loginSuccess"));
      setShowLoginModal(false);
      setStep(1);
    } else {
      toast.error(t("loginErrorShort"));
    }
  };

  // Step 1
  const validateStep1 = () => {
    if (!form.checkIn || !form.checkOut) return t("errNoDates");
    if (nights <= 0) return t("errCheckoutAfter");
    if (overLimit) return `${t("maxNightsError")} ${MAX_NIGHTS} ${t("maxNightsError2")}`;
    if (!form.doc.trim()) return t("errDocRequired");
    if (!form.name.trim()) return t("errNameRequired");
    if (!form.phone.trim()) return t("errPhoneRequired");
    if (!form.email.includes("@")) return t("errEmailInvalid");
    if (!form.emergencyName.trim() || !form.emergencyPhone.trim()) return t("errEmergencyContact");
    return null;
  };
  const nextFromDatos = () => {
    const err = validateStep1();
    if (err) return toast.error(err);
    setStep(2);
  };

  // Step 2
  const toPago = () => {
    if (!form.terms) return toast.error(t("errTerms"));
    setStep(3);
  };

  // Step 3
  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const num = pay.number.replace(/\s/g, "");
    if (num.length < 13) return toast.error(t("errCardNumber"));
    if (!pay.name.trim()) return toast.error(t("errCardHolder"));
    if (pay.expiry.length < 5) return toast.error(t("errExpiryInvalid"));
    if (pay.cvv.length < 3) return toast.error(t("errCvvInvalid"));
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (!cardType) { toast.error(t("errCardType")); return; }
      addReservation({
        id: code, code, listingId: l.id, listingName: l.name, district: l.district,
        image: l.images[0], checkIn: form.checkIn, checkOut: form.checkOut,
        nights: cost.nights, guests: form.guests, total: cost.total,
        status: "Activa", createdAt: new Date().toISOString(),
      });
      sendConfirmationEmail("Tarjeta de crédito");
      toast.success(t("paymentSuccess"));
      setStep(4);
    }, 2000);
  };

  return (
    <PageShell>
      <Navbar />

      <div className="mx-auto max-w-4xl px-5 pt-6 pb-12">
        <Link to="/property/$id" params={{ id: l.id }} className="inline-flex items-center gap-2 text-sm text-[#1F1F1F]/70 hover:text-[#B08A4A]">
          <ArrowLeft className="h-4 w-4" /> {t("backToDetail")}
        </Link>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2">
          {STEPS.map((label, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                  done ? "border-[#B08A4A] bg-[#B08A4A] text-white"
                  : active ? "border-[#B08A4A] text-[#B08A4A]"
                  : "border-[#E8E0D2] text-[#1F1F1F]/40"
                }`}>
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`hidden text-xs sm:inline ${active || done ? "text-[#1F1F1F]" : "text-[#1F1F1F]/40"}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? "bg-[#B08A4A]" : "bg-[#E8E0D2]"}`} />}
              </div>
            );
          })}
        </div>

        {/* STEP 0 — ACCOUNT */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 max-w-md mx-auto">
            <h1 className="font-lora text-2xl">{t("createAccount")}</h1>
            <p className="mt-2 text-sm text-[#1F1F1F]/65">{t("createAccountSubtitle")}</p>
            <form onSubmit={submitAccount} className="mt-6 space-y-3">
              <Field label={t("fullName")}>
                <input required value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} className="input" />
              </Field>
              <Field label={t("emailLabel")}>
                <input type="email" required value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} className="input" />
              </Field>
              <Field label={t("phoneLabel")}>
                <input required value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })} placeholder="+51 999 999 999" className="input" />
              </Field>
              <Field label={t("accountPasswordLabel")}>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} required value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} className="input pr-10" />
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F]/60">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <Field label={t("accountConfirmLabel")}>
                <input type="password" required value={account.confirm} onChange={(e) => setAccount({ ...account, confirm: e.target.value })} className="input" />
              </Field>
              <button type="submit" className="w-full rounded-full bg-[#B08A4A] py-3 text-sm font-medium text-white hover:bg-[#9a7740]">
                {t("createAndContinue")}
              </button>
              <p className="text-center text-xs text-[#1F1F1F]/60">
                {t("alreadyHaveAccount")}{" "}
                <button type="button" onClick={() => setShowLoginModal(true)} className="font-medium text-[#B08A4A] hover:underline">
                  {t("signInHere")}
                </button>
              </p>
            </form>
          </motion.div>
        )}

        {/* STEP 1 — DETAILS */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-8 md:grid-cols-[1fr,300px]">
            <form onSubmit={(e) => { e.preventDefault(); nextFromDatos(); }} className="space-y-4">
              <h1 className="font-lora text-2xl">{t("personalData")}</h1>
              <p className="-mt-3 rounded-lg bg-[#F5F1EB] px-3 py-2 text-xs text-[#1F1F1F]/70">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#B08A4A]" />
                {t("noOwnerNote")}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("arrival")}>
                  <input type="date" required value={form.checkIn} min={todayPlus(0)} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className="input" />
                </Field>
                <Field label={t("departure")}>
                  <input type="date" required value={form.checkOut} min={form.checkIn} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className="input" />
                </Field>
              </div>
              {overLimit && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {t("maxNightsError")} {MAX_NIGHTS} {t("maxNightsError2")}
                </p>
              )}
              <Field label={t("guestsMaxLabel")}>
                <select value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} className="input">
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} {n === 1 ? t("guestSingular") : t("guestPlural")}</option>)}
                </select>
              </Field>
              <Field label={t("docLabel")}>
                <div className="flex gap-2">
                  <select value={form.docType} onChange={(e) => setForm({ ...form, docType: e.target.value as "DNI" | "Pasaporte" })} className="input max-w-[130px]">
                    <option>DNI</option><option>Pasaporte</option>
                  </select>
                  <input required value={form.doc} onChange={(e) => setForm({ ...form, doc: e.target.value })} placeholder="12345678" className="input" />
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("fullName")}>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                </Field>
                <Field label={t("phoneLabel")}>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+51 999 999 999" className="input" />
                </Field>
              </div>
              <Field label={t("emailLabel")}>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
              </Field>
              <Field label={t("reasonLabel")}>
                <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="input">
                  <option>{t("reasonTourism")}</option>
                  <option>{t("reasonWork")}</option>
                  <option>{t("reasonRelocation")}</option>
                  <option>{t("reasonStudies")}</option>
                  <option>{t("reasonOther")}</option>
                </select>
              </Field>
              <div className="rounded-xl border border-[#E8E0D2] bg-[#FAF8F5] p-4">
                <h3 className="text-sm font-medium">{t("emergencyContactLabel")}</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label={t("nameLabel")}>
                    <input required value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} className="input" />
                  </Field>
                  <Field label={t("phoneLabel")}>
                    <input required value={form.emergencyPhone} onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })} className="input" />
                  </Field>
                </div>
              </div>
              <button type="submit" className="w-full rounded-full bg-[#B08A4A] py-3 text-sm font-medium text-white hover:bg-[#9a7740]">
                {t("continueBtn")}
              </button>
            </form>
            <SummaryAside l={l} cost={cost} guests={form.guests} t={t} />
          </motion.div>
        )}

        {/* STEP 2 — REVIEW */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <h1 className="font-lora text-2xl">{t("reviewBooking")}</h1>
            <div className="mt-5 flex gap-4 rounded-2xl border border-[#E8E0D2] bg-white p-4">
              <img src={l.images[0]} alt={l.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-lora text-lg">{l.name}</h3>
                <p className="text-xs text-[#1F1F1F]/60">{l.district}, {l.city}</p>
                <p className="mt-1 text-xs">{t("arrivalColon")} <b>{form.checkIn}</b> → {t("departureColon")} <b>{form.checkOut}</b></p>
                <p className="text-xs">{cost.nights} {cost.nights === 1 ? t("nightCount") : t("nightsCount")} · {form.guests} {form.guests > 1 ? t("guestPlural") : t("guestSingular")}</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[#E8E0D2]">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#E8E0D2]">
                  {[
                    [`${fmtUSD(l.price)} × ${cost.nights} ${cost.nights === 1 ? t("nightCount") : t("nightsCount")}`, fmtUSD(cost.base)],
                    [t("cleaningFee"), fmtUSD(cost.cleaning)],
                    [t("serviceFee"), fmtUSD(cost.service)],
                    [t("igv"), fmtUSD(cost.igv)],
                  ].map(([k, v]) => (
                    <tr key={k}><td className="px-4 py-3 text-[#1F1F1F]/70">{k}</td><td className="px-4 py-3 text-right">{v}</td></tr>
                  ))}
                  <tr className="bg-[#F5F1EB]">
                    <td className="px-4 py-3 font-medium">{t("total")}</td>
                    <td className="px-4 py-3 text-right font-lora text-2xl text-[#B08A4A]">{fmtUSD(cost.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5 rounded-2xl border border-[#E8E0D2] bg-white p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#B08A4A]" />
                <h3 className="font-lora text-base">{t("digitalContract")}</h3>
              </div>
              <div className="mt-3 rounded-lg border border-dashed border-[#E8E0D2] bg-[#FAF8F5] p-4 text-[11px] leading-relaxed text-[#1F1F1F]/70">
                <p className="font-medium text-[#1F1F1F]">{t("contractTitle")} {code}</p>
                <p className="mt-2">{t("contractBetween")} {form.name || "—"} {t("contractFor")} {form.checkIn} {t("contractTo")} {form.checkOut} ({cost.nights} {cost.nights === 1 ? t("nightCount") : t("nightsCount")}).</p>
                <ul className="mt-2 space-y-1">
                  <li>· {t("contractItem1")}</li>
                  <li>· {t("contractItem2")}</li>
                  <li>· {t("contractItem3")}</li>
                </ul>
              </div>
            </div>

            <label className="mt-5 flex items-start gap-2 text-sm">
              <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-1" />
              <span>{t("termsAccept")}</span>
            </label>

            <div className="mt-5 flex gap-3">
              <button onClick={() => setStep(1)} className="rounded-full border border-[#E8E0D2] px-6 py-3 text-sm hover:bg-[#F5F1EB]">
                {t("backBtn")}
              </button>
              <button onClick={toPago} className="flex-1 rounded-full bg-[#B08A4A] py-3 text-sm font-medium text-white hover:bg-[#9a7740]">
                {t("confirmPayBtn")}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — PAYMENT */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-8 md:grid-cols-[1fr,320px]">
            <div className="space-y-4">
              <h1 className="font-lora text-2xl">{t("paymentInfo")}</h1>
              <p className="-mt-2 flex items-center gap-1.5 text-xs text-[#1F1F1F]/65">
                <Lock className="h-3.5 w-3.5 text-[#B08A4A]" /> {t("sslNote")}
              </p>

              <div className="flex gap-2">
                <button type="button" onClick={() => setPayMethod("card")}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${payMethod === "card" ? "border-[#B08A4A] bg-[#B08A4A] text-white" : "border-[#E8E0D2] text-[#1F1F1F]/70 hover:border-[#B08A4A]"}`}>
                  <CreditCard className="h-4 w-4" /> {t("creditCard")}
                </button>
                <button type="button" onClick={() => setPayMethod("paypal")}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${payMethod === "paypal" ? "border-[#0070BA] bg-[#0070BA] text-white" : "border-[#E8E0D2] text-[#1F1F1F]/70 hover:border-[#0070BA]"}`}>
                  <Wallet className="h-4 w-4" /> PayPal
                </button>
              </div>

              {payMethod === "card" && (
                <form onSubmit={submitPayment} className="space-y-4">
                  <Field label={t("cardNumberLabel")}>
                    <div className="relative">
                      <input required inputMode="numeric" value={pay.number}
                        onChange={(e) => setPay({ ...pay, number: formatCard(e.target.value) })}
                        placeholder="1234 5678 9012 3456" className="input pr-16" />
                      {cardType && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#1F1F1F] px-2 py-0.5 text-[10px] font-medium text-white">
                          {cardType}
                        </span>
                      )}
                    </div>
                  </Field>
                  <Field label={t("cardHolderLabel")}>
                    <input required value={pay.name} onChange={(e) => setPay({ ...pay, name: e.target.value.toUpperCase() })} placeholder="MARIA PEREZ" className="input" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t("expiryLabel")}>
                      <input required value={pay.expiry} onChange={(e) => setPay({ ...pay, expiry: formatExpiry(e.target.value) })} placeholder="12/28" className="input" />
                    </Field>
                    <Field label="CVV">
                      <div className="relative">
                        <input required type={showCvv ? "text" : "password"} maxLength={3}
                          value={pay.cvv} onChange={(e) => setPay({ ...pay, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                          placeholder="123" className="input pr-10" />
                        <button type="button" onClick={() => setShowCvv(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F]/60">
                          {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </Field>
                  </div>
                  <div className="flex flex-wrap gap-3 rounded-xl bg-[#F5F1EB] px-4 py-3 text-[11px] text-[#1F1F1F]/70">
                    <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-600" /> {t("sslSecure")}</span>
                    <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-600" /> {t("encryptedData")}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-[#B08A4A]" /> Verified by Easy Stay</span>
                  </div>
                  <p className="text-center text-[11px] text-[#1F1F1F]/50">{t("paySecureNote")}</p>
                  <button type="submit" disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#B08A4A] py-3.5 text-sm font-medium text-white hover:bg-[#9a7740] disabled:opacity-70">
                    {processing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t("processingPaymentMsg")}</>
                    ) : (
                      <><CreditCard className="h-4 w-4" /> {t("confirmPayBtn")} — {fmtUSD(cost.total)} USD</>
                    )}
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="w-full text-center text-xs text-[#1F1F1F]/60 hover:text-[#B08A4A]">
                    {t("backToReview")}
                  </button>
                </form>
              )}

              {payMethod === "paypal" && (
                <div className="space-y-4">
                  <p style={{ color: '#003087', fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>PayPal</p>
                  <div style={{ background: '#F5F1EB', border: '0.5px solid #D8C9B8', borderRadius: '12px', padding: '16px' }}>
                    <p className="text-sm leading-relaxed text-[#1F1F1F]/75">{t("paypalRedirectNote")}</p>
                  </div>
                  <button type="button" disabled={processing}
                    onClick={() => {
                      setProcessing(true);
                      setTimeout(() => {
                        setProcessing(false);
                        addReservation({
                          id: code, code, listingId: l.id, listingName: l.name, district: l.district,
                          image: l.images[0], checkIn: form.checkIn, checkOut: form.checkOut,
                          nights: cost.nights, guests: form.guests, total: cost.total,
                          status: "En revisión", createdAt: new Date().toISOString(),
                        });
                        sendConfirmationEmail("PayPal");
                        toast.success(t("paypalSuccess"));
                        setStep(4);
                      }, 2000);
                    }}
                    style={{ width: '100%', background: '#0070BA', color: '#fff', borderRadius: '8px', padding: '14px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '14px', border: 'none', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t("processingPaypal")}</>
                    ) : (
                      `${t("confirmPayBtn")} PayPal — ${fmtUSD(cost.total)} USD`
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#1F1F1F]/50">{t("paySecureNote")}</p>
                  <button type="button" onClick={() => setStep(2)} className="w-full text-center text-xs text-[#1F1F1F]/60 hover:text-[#B08A4A]">
                    {t("backToReview")}
                  </button>
                </div>
              )}
            </div>
            <SummaryAside l={l} cost={cost} guests={form.guests} dates={`${form.checkIn} → ${form.checkOut}`} t={t} />
          </motion.div>
        )}

        {/* STEP 4 — CONFIRMATION */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </motion.div>
            <h1 className="mt-6 font-lora text-3xl">{t("confirmation")}</h1>
            <p className="mt-4 inline-block rounded-full border border-[#B08A4A] bg-[#FAF8F5] px-4 py-1.5 text-xs font-medium text-[#B08A4A]">
              {t("codeLabel")} #{code}
            </p>
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E8E0D2] bg-white p-5 text-left text-sm">
              <Row label={t("propertyLabel")} value={l.name} />
              <div className="flex justify-between py-0.5">
                <span className="text-[#1F1F1F]/70">{t("locationTitle")}</span>
                <span className="max-w-[55%] text-right font-medium">{l.address}, {l.district}</span>
              </div>
              <Row label={t("arrival")} value={form.checkIn} />
              <Row label={t("departure")} value={form.checkOut} />
              <Row label={t("nightsCount")} value={String(cost.nights)} />
              <div className="my-2 border-t border-[#E8E0D2]" />
              <Row label={t("totalPaid")} value={fmtUSD(cost.total)} bold />
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {language === "en" ? "Address unlocked — check your email for full details" : "Dirección desbloqueada — revisa tu correo con todos los detalles"}
            </p>
            <p className="mt-6 text-sm text-[#1F1F1F]/65">{t("contactNote")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate({ to: "/cuenta" })} className="rounded-full bg-[#B08A4A] px-6 py-3 text-sm font-medium text-white hover:bg-[#9a7740]">
                {t("viewBooking")}
              </button>
              <button onClick={() => navigate({ to: "/" })} className="rounded-full border border-[#B08A4A] px-6 py-3 text-sm font-medium text-[#B08A4A] hover:bg-[#F5F1EB]">
                {t("backHome")}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowLoginModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-lora text-xl">{t("loginTitle")}</h3>
            <form onSubmit={submitLogin} className="mt-4 space-y-3">
              <Field label={t("emailShort")}>
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="input" />
              </Field>
              <Field label={t("passwordLabel")}>
                <input type="password" required value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} className="input" />
              </Field>
              <button type="submit" className="w-full rounded-full bg-[#B08A4A] py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]">
                {t("submitLogin")}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #E8E0D2;
          background: #FAF8F5;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #1F1F1F;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: #B08A4A; }
      `}</style>
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

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-[#1F1F1F]/70">{label}</span>
      <span className={bold ? "font-lora text-lg text-[#B08A4A]" : "font-medium"}>{value}</span>
    </div>
  );
}

function SummaryAside({
  l, cost, guests, dates, t,
}: {
  l: ReturnType<typeof getListing> & object;
  cost: ReturnType<typeof computeCost>;
  guests: number;
  dates?: string;
  t: (k: string) => string;
}) {
  return (
    <aside className="h-fit rounded-2xl border border-[#E8E0D2] bg-[#F5F1EB] p-5">
      <div className="flex gap-3">
        <img src={l.images[0]} alt={l.name} className="h-14 w-14 rounded-lg object-cover" />
        <div>
          <h3 className="font-lora text-sm leading-tight">{l.name}</h3>
          <p className="text-[11px] text-[#1F1F1F]/60">{l.district}, {l.city}</p>
        </div>
      </div>
      {dates && <p className="mt-3 text-[11px] text-[#1F1F1F]/60">{dates}</p>}
      <p className="mt-1 text-[11px] text-[#1F1F1F]/60">
        {cost.nights} {cost.nights === 1 ? t("nightCount") : t("nightsCount")} · {guests} {guests > 1 ? t("guestPlural") : t("guestSingular")}
      </p>
      <div className="mt-4 space-y-2 text-sm">
        <Row label={`${fmtUSD(l.price)} × ${cost.nights}`} value={fmtUSD(cost.base)} />
        <Row label={t("cleaningShort")} value={fmtUSD(cost.cleaning)} />
        <Row label={t("serviceShort")} value={fmtUSD(cost.service)} />
        <Row label={t("igv")} value={fmtUSD(cost.igv)} />
        <div className="my-2 border-t border-[#E8E0D2]" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">{t("total")}</span>
          <span className="font-lora text-xl text-[#B08A4A]">{fmtUSD(cost.total)}</span>
        </div>
      </div>
    </aside>
  );
}
