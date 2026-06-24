import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { useLanguage } from "../lib/i18n";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { loginWithCredentials, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      toast.error(t("generalError"));
    }, 5000);
    try {
      if (mode === "login") {
        if (loginWithCredentials(email, password)) {
          toast.success(t("welcomeBack"));
          navigate({ to: "/cuenta" });
        } else {
          setError(t("loginError"));
        }
      } else {
        if (!name.trim() || !email.trim() || password.length < 6) {
          setError(t("registerError"));
        } else {
          register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
          toast.success(t("accountCreated"));
          navigate({ to: "/cuenta" });
        }
      }
    } catch (err) {
      console.warn("login submit error", err);
      toast.error(t("generalError"));
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 py-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="block text-center font-lora text-2xl tracking-[0.22em] text-[#B08A4A]">
            EASY STAY
          </Link>
          <div className="mt-8 rounded-2xl border border-[#E8E0D2] bg-white p-7">
            <div className="mb-5 flex rounded-full bg-[#FAF8F5] p-1 text-xs">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 rounded-full py-2 font-medium transition ${mode === "login" ? "bg-[#B08A4A] text-white" : "text-[#1F1F1F]/60"}`}
              >
                {t("loginTab")}
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 rounded-full py-2 font-medium transition ${mode === "register" ? "bg-[#B08A4A] text-white" : "text-[#1F1F1F]/60"}`}
              >
                {t("registerTab")}
              </button>
            </div>
            <h1 className="font-lora text-2xl">{mode === "login" ? t("loginTitle") : t("registerTitle")}</h1>
            <form onSubmit={submit} className="mt-5 space-y-3">
              {mode === "register" && (
                <>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[#1F1F1F]/70">{t("fullName")}</span>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-2.5 text-sm outline-none focus:border-[#B08A4A]" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[#1F1F1F]/70">{t("phoneLabel")}</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 9XX XXX XXX"
                      className="w-full rounded-lg border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-2.5 text-sm outline-none focus:border-[#B08A4A]" />
                  </label>
                </>
              )}
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#1F1F1F]/70">{t("emailLabel")}</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-2.5 text-sm outline-none focus:border-[#B08A4A]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#1F1F1F]/70">{t("passwordLabel")}</span>
                <div className="relative">
                  <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E0D2] bg-[#FAF8F5] px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#B08A4A]" />
                  <button type="button" onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1F1F1F]/60"
                    aria-label={t("showPasswordLabel")}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-[#B08A4A] py-3 text-sm font-medium text-white hover:bg-[#9a7740] disabled:opacity-60">
                {loading ? t("processing") : mode === "login" ? t("submitLogin") : t("submitRegister")}
              </button>
            </form>
            <p className="mt-5 text-center text-xs text-[#1F1F1F]/60">
              {mode === "login" ? (
                <>{t("noAccountYet")}{" "}
                  <button type="button" onClick={() => { setMode("register"); setError(""); }} className="font-medium text-[#B08A4A] hover:underline">
                    {t("createHere")}
                  </button>
                </>
              ) : (
                <>{t("alreadyHaveAccount")}{" "}
                  <button type="button" onClick={() => { setMode("login"); setError(""); }} className="font-medium text-[#B08A4A] hover:underline">
                    {t("signInHere")}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
