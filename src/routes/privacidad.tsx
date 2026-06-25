import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — Easy Stay" },
      { name: "description", content: "Cómo Easy Stay recopila, usa y protege tus datos personales." },
    ],
  }),
  component: Privacidad,
});

const sections = [
  { id: "datos", title: "1. Datos que recopilamos" },
  { id: "uso", title: "2. Cómo usamos tus datos" },
  { id: "compartir", title: "3. Con quién compartimos tus datos" },
  { id: "seguridad", title: "4. Seguridad de tus datos" },
  { id: "derechos", title: "5. Tus derechos (Ley N°29733)" },
  { id: "cookies", title: "6. Cookies" },
  { id: "retencion", title: "7. Retención de datos" },
  { id: "internacional", title: "8. Transferencia internacional" },
  { id: "contacto", title: "9. Contacto" },
];

function Privacidad() {
  const router = useRouter();
  return (
    <PageShell>
      <Navbar />

      <div className="sticky top-16 z-20 border-b border-[#E8E0D2] bg-[#FAF8F5]/90 backdrop-blur">
        <div className="mx-auto max-w-4xl px-5 py-3">
          <button
            onClick={() => router.history.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#E8E0D2] bg-white px-3 py-1.5 text-xs font-medium text-[#1F1F1F] hover:border-[#B08A4A] hover:text-[#B08A4A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-5 py-10">
        <p className="font-lora text-sm tracking-[0.22em] text-[#B08A4A]">EASY STAY</p>
        <h1 className="mt-2 font-lora text-4xl text-[#1F1F1F] md:text-5xl">Política de privacidad</h1>
        <p className="mt-2 text-xs text-[#1F1F1F]/60">Última actualización: mayo 2026</p>
        <p className="mt-6 text-sm leading-relaxed text-[#1F1F1F]/80">
          Easy Stay está comprometida con la protección de tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos tu información, en cumplimiento de la Ley N°29733 de Protección de Datos Personales del Perú.
        </p>

        <nav className="mt-8 rounded-2xl border border-[#E8E0D2] bg-[#F5F1EB] p-5">
          <h2 className="font-lora text-base text-[#1F1F1F]">Contenido</h2>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-[#1F1F1F]/75 hover:text-[#B08A4A]">{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <Section id="datos" title="1. Datos que recopilamos">
          <p>Al usar Easy Stay recopilamos la siguiente información:</p>
          <ul>
            <li><b>Datos de identidad:</b> nombre completo, número de DNI o pasaporte, nacionalidad.</li>
            <li><b>Datos de contacto:</b> correo electrónico, número de teléfono, contacto de emergencia.</li>
            <li><b>Datos de la reserva:</b> fechas de estadía, inmueble seleccionado, número de huéspedes, motivo de la estadía.</li>
            <li><b>Datos de pago:</b> tipo de tarjeta y últimos 4 dígitos (nunca almacenamos el número completo).</li>
            <li><b>Datos de uso:</b> páginas visitadas, búsquedas realizadas, preferencias de inmuebles.</li>
            <li><b>Datos del dispositivo:</b> dirección IP, tipo de navegador, sistema operativo.</li>
          </ul>
        </Section>

        <Section id="uso" title="2. Cómo usamos tus datos">
          <ul>
            <li>Procesar y gestionar tu reserva.</li>
            <li>Comunicarnos contigo antes, durante y después de tu estadía.</li>
            <li>Asignarte atención personalizada de nuestro equipo.</li>
            <li>Enviarte confirmaciones, recordatorios y actualizaciones de tu reserva.</li>
            <li>Mejorar la experiencia en la plataforma mediante análisis de uso.</li>
            <li>Cumplir con obligaciones legales y regulatorias.</li>
            <li>Prevenir fraudes y garantizar la seguridad de la plataforma.</li>
          </ul>
        </Section>

        <Section id="compartir" title="3. Con quién compartimos tus datos">
          <p>Easy Stay <b>NO vende ni alquila</b> tus datos personales a terceros. Compartimos información únicamente con:</p>
          <ul>
            <li>Proveedores de procesamiento de pagos (bajo estrictos contratos de confidencialidad).</li>
            <li>Autoridades peruanas cuando sea requerido por ley (SUNAT, Policía Nacional, INDECOPI).</li>
            <li>Proveedores de servicios tecnológicos que operan bajo acuerdos de protección de datos.</li>
            <li>En ningún caso compartimos tus datos con los propietarios de los inmuebles.</li>
          </ul>
        </Section>

        <Section id="seguridad" title="4. Seguridad de tus datos">
          <ul>
            <li>Toda la información transmitida usa encriptación SSL de 256 bits.</li>
            <li>Los datos de tarjeta nunca se almacenan en nuestros servidores.</li>
            <li>Acceso restringido a datos personales solo para personal autorizado de Easy Stay.</li>
            <li>Monitoreo continuo para detectar accesos no autorizados.</li>
            <li>En caso de brecha de seguridad, notificaremos a los usuarios afectados dentro de las 72 horas.</li>
          </ul>
        </Section>

        <Section id="derechos" title="5. Tus derechos (Ley N°29733)">
          <p>Como titular de datos personales en Perú tienes derecho a:</p>
          <ul>
            <li><b>Acceso:</b> solicitar qué datos tenemos sobre ti.</li>
            <li><b>Rectificación:</b> corregir datos incorrectos o desactualizados.</li>
            <li><b>Cancelación:</b> solicitar la eliminación de tus datos.</li>
            <li><b>Oposición:</b> oponerte al uso de tus datos para fines específicos.</li>
          </ul>
          <p>
            Para ejercer estos derechos escribe a <a href="mailto:privacidad@easystay.pe" className="text-[#B08A4A] hover:underline">privacidad@easystay.pe</a> con asunto "Derechos ARCO". Responderemos en un plazo máximo de 20 días hábiles.
          </p>
        </Section>

        <Section id="cookies" title="6. Cookies">
          <p>Easy Stay usa cookies para:</p>
          <ul>
            <li>Mantener tu sesión iniciada.</li>
            <li>Recordar tus preferencias de búsqueda.</li>
            <li>Analizar el comportamiento de uso (datos agregados y anónimos).</li>
          </ul>
          <p>Puedes desactivar las cookies desde la configuración de tu navegador, aunque algunas funciones de la plataforma pueden verse afectadas.</p>
        </Section>

        <Section id="retencion" title="7. Retención de datos">
          <ul>
            <li><b>Datos de cuenta:</b> mientras la cuenta esté activa + 2 años adicionales.</li>
            <li><b>Datos de reservas:</b> 5 años por obligaciones tributarias (SUNAT).</li>
            <li><b>Datos de pago:</b> 6 meses tras la transacción (solo referencia, nunca número completo).</li>
          </ul>
          <p>Puedes solicitar la eliminación anticipada de tus datos escribiendo a privacidad@easystay.pe.</p>
        </Section>

        <Section id="internacional" title="8. Transferencia internacional">
          <p>
            Easy Stay puede usar servicios tecnológicos con servidores fuera de Perú (como servicios de cloud computing). En todos los casos garantizamos que dichos servicios cumplen con estándares equivalentes o superiores de protección de datos.
          </p>
        </Section>

        <Section id="contacto" title="9. Contacto">
          <p>Para consultas sobre privacidad:</p>
          <ul>
            <li><b>Correo electrónico:</b> <a href="mailto:privacidad@easystay.pe" className="text-[#B08A4A] hover:underline">privacidad@easystay.pe</a></li>
            <li><b>Dirección:</b> Lima, Perú</li>
            <li><b>Autoridad de control:</b> INDECOPI — <a href="https://www.indecopi.gob.pe" target="_blank" rel="noreferrer" className="text-[#B08A4A] hover:underline">www.indecopi.gob.pe</a></li>
          </ul>
        </Section>

        <div className="mt-12 rounded-2xl border border-[#B08A4A]/30 bg-[#F5F1EB] p-6 text-center">
          <p className="font-lora text-lg text-[#1F1F1F]">¿Tienes dudas sobre cómo protegemos tus datos?</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:privacidad@easystay.pe"
              className="inline-flex items-center justify-center rounded-full bg-[#B08A4A] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
            >
              Contáctanos
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-[#B08A4A] px-6 py-2.5 text-sm font-medium text-[#B08A4A] hover:bg-white"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </PageShell>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-32 border-l-2 border-[#B08A4A] pl-4">
      <h2 className="font-lora text-2xl text-[#1F1F1F]">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#1F1F1F]/80 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
