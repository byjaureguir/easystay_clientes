import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { WishlistProvider } from "../lib/wishlist";
import { AuthProvider } from "../lib/auth";
import { UIProvider } from "../lib/ui";
import { LanguageProvider } from "../lib/i18n";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-lora text-7xl text-[#B08A4A]">404</h1>
        <h2 className="mt-4 font-lora text-xl text-[#1F1F1F]">Página no encontrada</h2>
        <p className="mt-2 text-sm text-[#1F1F1F]/60">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#B08A4A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-lora text-xl text-[#1F1F1F]">
          Esta página no cargó
        </h1>
        <p className="mt-2 text-sm text-[#1F1F1F]/60">
          Algo salió mal de nuestro lado. Puedes reintentar o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#B08A4A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#9a7740]"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#B08A4A] px-5 py-2.5 text-sm font-medium text-[#B08A4A] hover:bg-[#F5F1EB]"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Easy Stay — Alquiler temporal premium en Lima" },
      {
        name: "description",
        content:
          "Easy Stay: departamentos seleccionados para estadías temporales en Miraflores, San Isidro, Barranco y más distritos de Lima.",
      },
      { property: "og:title", content: "Easy Stay — Alquiler temporal premium en Lima" },
      { name: "twitter:title", content: "Easy Stay — Alquiler temporal premium en Lima" },
      { name: "description", content: "Easy Stay Lima es una plataforma premium de alquiler temporal para huéspedes en Lima, Perú." },
      { property: "og:description", content: "Easy Stay Lima es una plataforma premium de alquiler temporal para huéspedes en Lima, Perú." },
      { name: "twitter:description", content: "Easy Stay Lima es una plataforma premium de alquiler temporal para huéspedes en Lima, Perú." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1190e353-c264-4292-a6ca-2d7948c50622/id-preview-cfeb102c--ceeb946b-66e3-44b7-9778-5bfed87282a4.lovable.app-1779934472657.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1190e353-c264-4292-a6ca-2d7948c50622/id-preview-cfeb102c--ceeb946b-66e3-44b7-9778-5bfed87282a4.lovable.app-1779934472657.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <UIProvider>
            <LanguageProvider>
              <Outlet />
              <Toaster position="top-center" richColors />
            </LanguageProvider>
          </UIProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
