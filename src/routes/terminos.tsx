import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones — Easy Stay" },
      { name: "description", content: "Términos y condiciones de uso de la plataforma Easy Stay." },
    ],
  }),
  component: Terminos,
});

const sections = [
  { id: "easy-stay", title: "1. Sobre Easy Stay" },
  { id: "elegibilidad", title: "2. Elegibilidad y registro" },
  { id: "reservas", title: "3. Reservas y estadías" },
  { id: "precios", title: "4. Precios y pagos" },
  { id: "cancelacion", title: "5. Política de cancelación" },
  { id: "huesped", title: "6. Obligaciones del huésped" },
  { id: "easystay-resp", title: "7. Responsabilidades de Easy Stay" },
  { id: "modificaciones", title: "8. Modificaciones" },
  { id: "ley", title: "9. Ley aplicable" },
];

function Terminos() {
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
        <h1 className="mt-2 font-lora text-4xl text-[#1F1F1F] md:text-5xl">Términos y Condiciones</h1>
        <p className="mt-2 text-xs text-[#1F1F1F]/60">Última actualización: mayo 2026</p>
        <p className="mt-6 text-sm leading-relaxed text-[#1F1F1F]/80">
          Al acceder y utilizar la plataforma Easy Stay, aceptas los siguientes términos y condiciones. Te recomendamos leerlos detenidamente antes de realizar cualquier reserva.
        </p>

        {/* TOC */}
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

        <Section id="easy-stay" title="1. Sobre Easy Stay">
          <p>
            Easy Stay es una plataforma de alojamiento de corta estadía que gestiona inmuebles de manera directa en Lima, Perú. A diferencia de otras plataformas, Easy Stay actúa como único operador y punto de contacto del huésped — no existe trato directo entre el huésped y el propietario del inmueble en ningún momento del proceso.
          </p>
        </Section>

        <Section id="elegibilidad" title="2. Elegibilidad y registro">
          <ul>
            <li>Para realizar una reserva debes ser mayor de 18 años.</li>
            <li>Debes proporcionar información verídica al momento de crear tu cuenta.</li>
            <li>Una cuenta por persona — no se permite el registro duplicado con el mismo correo electrónico.</li>
            <li>Easy Stay se reserva el derecho de suspender cuentas que incumplan estos términos.</li>
            <li>La cuenta se crea exclusivamente durante el proceso de reserva.</li>
          </ul>
        </Section>

        <Section id="reservas" title="3. Reservas y estadías">
          <ul>
            <li>Las estadías tienen una duración mínima de 1 noche y máxima de 60 noches consecutivas.</li>
            <li>Cada inmueble admite un máximo de 4 huéspedes.</li>
            <li>La dirección exacta del inmueble se entrega únicamente tras la confirmación del pago.</li>
            <li>Easy Stay se reserva el derecho de reasignar un inmueble equivalente o superior en caso de inconvenientes operativos, notificando al huésped con anticipación.</li>
            <li>No se permite el subarrendamiento ni la cesión de la reserva a terceros.</li>
            <li>Las reservas son personales e intransferibles.</li>
          </ul>
        </Section>

        <Section id="precios" title="4. Precios y pagos">
          <ul>
            <li>Todos los precios se expresan en dólares americanos (USD) e incluyen IGV.</li>
            <li>El precio base es de $500 USD por noche, sujeto a variaciones según el inmueble.</li>
            <li>Se requiere el pago completo al momento de confirmar la reserva.</li>
            <li>Easy Stay no almacena datos de tarjetas de crédito o débito — los pagos son procesados con encriptación SSL de 256 bits.</li>
            <li>En caso de error en el cobro, Easy Stay realizará el reembolso correspondiente en un plazo máximo de 10 días hábiles.</li>
          </ul>
        </Section>

        <Section id="cancelacion" title="5. Política de cancelación">
          <ul>
            <li><b>Cancelación gratuita:</b> hasta 48 horas antes de la llegada → reembolso del 100%.</li>
            <li>Cancelación entre 48 y 24 horas antes de la llegada → se retiene el equivalente a 1 noche ($500 USD).</li>
            <li>Cancelación con menos de 24 horas o ausencia sin aviso → se retiene el equivalente a 2 noches ($1,000 USD).</li>
            <li>Easy Stay puede cancelar una reserva por causa mayor (desastres naturales, emergencias sanitarias, daños estructurales imprevistos) con reembolso total al huésped.</li>
            <li>Las solicitudes de cancelación deben realizarse a través de la plataforma o escribiendo a hola@easystay.pe.</li>
          </ul>
        </Section>

        <Section id="huesped" title="6. Obligaciones del huésped">
          <ul>
            <li>Respetar las normas de convivencia del edificio.</li>
            <li>No realizar fiestas, eventos o reuniones que superen la capacidad máxima de 4 personas.</li>
            <li>No fumar dentro del inmueble.</li>
            <li>Reportar cualquier daño o desperfecto a través de la plataforma dentro de las primeras 4 horas tras la llegada.</li>
            <li>El huésped es responsable de los daños causados durante su estadía más allá del desgaste natural.</li>
            <li>Devolver el inmueble en las mismas condiciones en que fue recibido.</li>
          </ul>
        </Section>

        <Section id="easystay-resp" title="7. Responsabilidades de Easy Stay">
          <ul>
            <li>Garantizar que el inmueble esté en las condiciones descritas en la plataforma al momento de la llegada.</li>
            <li>Proporcionar atención personalizada disponible durante toda la estadía.</li>
            <li>Responder a solicitudes de mantenimiento dentro de las 2 horas en días hábiles y 4 horas en fines de semana.</li>
            <li>Gestionar emergencias de forma inmediata a través de la línea 24/7: +51 900 000 000.</li>
            <li>Easy Stay no se responsabiliza por objetos de valor dejados en el inmueble sin custodia solicitada.</li>
          </ul>
        </Section>

        <Section id="modificaciones" title="8. Modificaciones">
          <p>
            Easy Stay se reserva el derecho de actualizar estos términos en cualquier momento. Los cambios serán notificados por correo electrónico con al menos 15 días de anticipación. El uso continuo de la plataforma tras la notificación implica la aceptación de los nuevos términos.
          </p>
        </Section>

        <Section id="ley" title="9. Ley aplicable">
          <p>
            Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia será sometida a los tribunales competentes de Lima, Perú. En caso de disputas de consumo, el huésped puede acudir al INDECOPI.
          </p>
        </Section>

        <div className="mt-12 rounded-2xl border border-[#B08A4A]/30 bg-[#F5F1EB] p-6 text-center">
          <p className="font-lora text-lg text-[#1F1F1F]">¿Tienes preguntas sobre nuestros términos?</p>
          <p className="mt-1 text-sm text-[#1F1F1F]/70">
            Escríbenos a <a href="mailto:legal@easystay.pe" className="text-[#B08A4A] hover:underline">legal@easystay.pe</a>
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#B08A4A] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
          >
            Volver al inicio
          </Link>
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
