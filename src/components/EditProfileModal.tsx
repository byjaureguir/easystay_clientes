import { useEffect, useRef, useState } from "react";
import { Camera, X, Eye, EyeOff, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";

const DISTRICTS = ["Miraflores", "San Isidro", "Barranco", "Surco", "San Borja", "Lince", "Magdalena", "La Molina", "Otro"];

export function EditProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentUser, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [district, setDistrict] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const [showPwd, setShowPwd] = useState(false);
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confPwd, setConfPwd] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone((currentUser.phone || "").replace(/^\+51\s*/, ""));
      setDni(currentUser.dni || "");
      setBirthDate(currentUser.birthDate || "");
      setDistrict(currentUser.district || "");
      setPhoto(currentUser.photo);
      setShowPwd(false);
      setCurPwd(""); setNewPwd(""); setConfPwd("");
      setErrors({});
    }
  }, [open, currentUser]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open || !currentUser) return null;

  const initials = (name || currentUser.name).split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();

  const onPickPhoto = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("La imagen no debe superar 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setPhoto(data);
      updateUser({ photo: data });
      toast.success("Foto actualizada correctamente");
    };
    reader.readAsDataURL(f);
  };

  const passwordsMatch = newPwd.length >= 8 && newPwd === confPwd;

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Ingresa tu nombre";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Correo inválido";
    if (!phone.trim()) errs.phone = "Ingresa tu teléfono";
    if (showPwd && (curPwd || newPwd || confPwd)) {
      if (newPwd.length < 8) errs.newPwd = "Mínimo 8 caracteres";
      if (newPwd !== confPwd) errs.confPwd = "Las contraseñas no coinciden";
      if (!curPwd) errs.curPwd = "Ingresa tu contraseña actual";
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const fullPhone = phone.startsWith("+51") ? phone : `+51 ${phone}`;
    updateUser({
      name: name.trim(),
      email: email.trim(),
      phone: fullPhone,
      dni: dni.trim() || undefined,
      birthDate: birthDate || undefined,
      district: district || undefined,
      photo,
      ...(showPwd && newPwd ? { password: newPwd } : {}),
    });
    toast.success("¡Perfil actualizado correctamente!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[12px] border border-[#D8C9B8] bg-[#F5F1EB] shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D8C9B8] bg-[#F5F1EB] px-6 py-4">
          <h2 className="font-lora text-2xl text-[#1F1F1F]">Editar perfil</h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-1 hover:bg-[#E8E0D2]">
            <X className="h-5 w-5 text-[#1F1F1F]" />
          </button>
        </div>

        <form onSubmit={onSave} className="px-6 py-5 font-poppins text-sm">
          {/* Photo */}
          <div className="flex flex-col items-center gap-2">
            <button type="button" onClick={onPickPhoto} className="group relative h-20 w-20 overflow-hidden rounded-full">
              {photo ? (
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#B08A4A] font-lora text-2xl text-white">{initials}</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-[#B08A4A]/70 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </button>
            <button type="button" onClick={onPickPhoto} className="font-poppins text-xs text-[#B08A4A] hover:underline">
              Cambiar foto
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>

          {/* Fields */}
          <div className="mt-5 space-y-3">
            <Field label="Nombre completo" error={errors.name}>
              <input value={name} onChange={(e) => setName(e.target.value)} className="ep-input" />
            </Field>
            <Field label="Correo electrónico" error={errors.email} hint="El correo es tu identificador de cuenta">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ep-input" />
            </Field>
            <Field label="Teléfono" error={errors.phone}>
              <div className="flex items-stretch overflow-hidden rounded-lg border border-[#E8E0D2] bg-white focus-within:border-[#B08A4A]">
                <span className="flex items-center bg-[#FAF8F5] px-3 text-xs text-[#1F1F1F]/60">+51</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/^\+51\s*/, ""))} className="w-full bg-white px-3 py-2.5 text-sm outline-none" />
              </div>
            </Field>
            <Field label="DNI / Pasaporte">
              <input value={dni} onChange={(e) => setDni(e.target.value)} className="ep-input" />
            </Field>
            <Field label="Fecha de nacimiento">
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="ep-input" />
            </Field>
            <Field label="Distrito de residencia">
              <div className="relative">
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="ep-input appearance-none pr-9">
                  <option value="">Selecciona un distrito</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F1F1F]/40" />
              </div>
            </Field>
          </div>

          {/* Password */}
          <div className="mt-5 border-t border-[#E8E0D2] pt-4">
            <button type="button" onClick={() => setShowPwd((s) => !s)} className="flex w-full items-center justify-between text-sm font-medium text-[#B08A4A]">
              <span>Cambiar contraseña</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showPwd ? "rotate-180" : ""}`} />
            </button>
            {showPwd && (
              <div className="mt-3 space-y-3">
                <Field label="Contraseña actual" error={errors.curPwd}>
                  <PwdInput value={curPwd} onChange={setCurPwd} show={showCur} setShow={setShowCur} />
                </Field>
                <Field label="Nueva contraseña" error={errors.newPwd}>
                  <PwdInput value={newPwd} onChange={setNewPwd} show={showNew} setShow={setShowNew} />
                </Field>
                <Field label="Confirmar nueva contraseña" error={errors.confPwd}>
                  <div className="relative">
                    <PwdInput value={confPwd} onChange={setConfPwd} show={showConf} setShow={setShowConf} />
                    {passwordsMatch && (
                      <Check className="pointer-events-none absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                    )}
                  </div>
                </Field>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button type="button" onClick={onClose} className="rounded-full border border-[#E8E0D2] px-5 py-2.5 text-sm hover:bg-[#E8E0D2]">
              Cancelar
            </button>
            <button type="submit" className="rounded-full bg-[#B08A4A] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#9a7740] sm:w-auto w-full">
              Guardar cambios
            </button>
          </div>
        </form>

        <style>{`
          .ep-input {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid #E8E0D2;
            background: #fff;
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
            outline: none;
            font-family: inherit;
          }
          .ep-input:focus { border-color: #B08A4A; box-shadow: none; }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[#1F1F1F]/70">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-[10px] text-[#1F1F1F]/50">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-red-600">{error}</span>}
    </label>
  );
}

function PwdInput({ value, onChange, show, setShow }: { value: string; onChange: (v: string) => void; show: boolean; setShow: (b: boolean) => void }) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ep-input pr-10"
      />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F1F1F]/50 hover:text-[#B08A4A]">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
