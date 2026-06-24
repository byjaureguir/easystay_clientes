export type CertScores = {
  limpieza: number;
  equipamiento: number;
  conectividad: number;
  seguridad: number;
  confort: number;
};

export type Listing = {
  id: string;
  name: string;
  district: string;
  city: string;
  address: string;
  /** Price per night in USD */
  price: number;
  /** Original price per night (USD) for "oferta" */
  originalPrice?: number;
  rating: number;
  reviews: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  area: number;
  badge: "Disponible" | "Última unidad" | "Oferta" | "Nuevo";
  type: "Estudio" | "1 habitación" | "2 habitaciones" | "Penthouse";
  terrace: boolean;
  petFriendly: boolean;
  furnished: boolean;
  seaView: boolean;
  description: string;
  features: string[];
  images: string[];
  cert: CertScores;
  hostInitials: string;
  videoUrl?: string;
};

const u = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1400&q=80`;

const baseCert = (): CertScores => ({
  limpieza: 9.6,
  equipamiento: 9.2,
  conectividad: 9.8,
  seguridad: 9.5,
  confort: 9.4,
});

export const listings: Listing[] = [
  {
    id: "1",
    name: "Loft Mirador Malecón",
    district: "Miraflores",
    city: "Lima",
    address: "Av. Malecón Cisneros 245",
    price: 890,
    rating: 4.9, reviews: 128, bedrooms: 1, bathrooms: 1, guests: 2, area: 62,
    badge: "Nuevo", type: "1 habitación",
    terrace: true, petFriendly: false, furnished: true, seaView: true,
    description: "Loft de diseño con vista directa al malecón y al océano. Acabados en madera natural, cocina equipada y terraza privada con mobiliario premium.",
    features: ["WiFi", "A/C", "Cocina equipada", "Estacionamiento", "Piscina", "Gimnasio", "Seguridad 24h", "Lavandería", "Balcón", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1505693416388-ac5ce068fe85"), u("photo-1522708323590-d24dbb6b0267"), u("photo-1560448204-e02f11c3d0e2"), u("photo-1493809842364-78817add7ffb"), u("photo-1600585154340-be6161a56a0c")],
    cert: baseCert(), hostInitials: "ES",
  },
  {
    id: "2",
    name: "Estudio Boutique San Isidro",
    district: "San Isidro", city: "Lima", address: "Calle Los Olivos 178",
    price: 640,
    rating: 4.8, reviews: 94, bedrooms: 0, bathrooms: 1, guests: 2, area: 38,
    badge: "Disponible", type: "Estudio",
    terrace: false, petFriendly: true, furnished: true, seaView: false,
    description: "Estudio elegante en el corazón financiero de Lima. Mobiliario europeo, cocina compacta totalmente equipada y servicios incluidos.",
    features: ["WiFi", "A/C", "Cocina equipada", "Seguridad 24h", "Lavandería", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1502672260266-1c1ef2d93688"), u("photo-1505691938895-1758d7feb511"), u("photo-1560185007-cde436f6a4d0"), u("photo-1493809842364-78817add7ffb"), u("photo-1560448204-e02f11c3d0e2")],
    cert: { ...baseCert(), equipamiento: 9.0 }, hostInitials: "ES",
  },
  {
    id: "3",
    name: "Penthouse Barranco Art",
    district: "Barranco", city: "Lima", address: "Jr. Pedro de Osma 512",
    price: 1180,
    originalPrice: 1450,
    rating: 5.0, reviews: 56, bedrooms: 2, bathrooms: 2, guests: 4, area: 110,
    badge: "Oferta", type: "Penthouse",
    terrace: true, petFriendly: true, furnished: true, seaView: false,
    description: "Penthouse de dos dormitorios con terraza panorámica sobre el barrio bohemio de Barranco. Diseño curado con piezas de arte peruano contemporáneo.",
    features: ["WiFi", "A/C", "Cocina equipada", "Estacionamiento", "Piscina", "Gimnasio", "Seguridad 24h", "Lavandería", "Balcón", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1560448204-e02f11c3d0e2"), u("photo-1600607687939-ce8a6c25118c"), u("photo-1600566753190-17f0baa2a6c3"), u("photo-1600585154340-be6161a56a0c"), u("photo-1600210492486-724fe5c67fb0")],
    cert: baseCert(), hostInitials: "ES",
  },
  {
    id: "4",
    name: "Departamento Surco Garden",
    district: "Surco", city: "Lima", address: "Av. Primavera 1320",
    price: 680,
    rating: 4.7, reviews: 71, bedrooms: 2, bathrooms: 2, guests: 4, area: 88,
    badge: "Disponible", type: "2 habitaciones",
    terrace: false, petFriendly: true, furnished: true, seaView: false,
    description: "Departamento familiar en zona residencial premium, cerca de centros comerciales y colegios internacionales. Piscina, gimnasio y zonas verdes.",
    features: ["WiFi", "A/C", "Cocina equipada", "Estacionamiento", "Piscina", "Gimnasio", "Seguridad 24h", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1493809842364-78817add7ffb"), u("photo-1600585154340-be6161a56a0c"), u("photo-1505691938895-1758d7feb511"), u("photo-1560185007-cde436f6a4d0"), u("photo-1522708323590-d24dbb6b0267")],
    cert: { ...baseCert(), confort: 9.0 }, hostInitials: "ES",
    videoUrl: "https://www.youtube.com/embed/CL6i_hkB12E",
  },
  {
    id: "5",
    name: "Estudio Plaza Larcomar",
    district: "Miraflores", city: "Lima", address: "Calle Shell 284",
    price: 720,
    rating: 4.6, reviews: 42, bedrooms: 0, bathrooms: 1, guests: 2, area: 34,
    badge: "Última unidad", type: "Estudio",
    terrace: false, petFriendly: false, furnished: true, seaView: true,
    description: "Estudio compacto y luminoso a metros del centro comercial Larcomar. Perfecto para profesionales con servicio de limpieza incluido.",
    features: ["WiFi", "A/C", "Cocina equipada", "Seguridad 24h", "Lavandería", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1522708323590-d24dbb6b0267"), u("photo-1502672260266-1c1ef2d93688"), u("photo-1505691938895-1758d7feb511"), u("photo-1560185007-cde436f6a4d0"), u("photo-1493809842364-78817add7ffb")],
    cert: baseCert(), hostInitials: "ES",
  },
  {
    id: "6",
    name: "Suite Ejecutiva La Molina",
    district: "La Molina", city: "Lima", address: "Av. La Fontana 845",
    price: 750,
    rating: 4.9, reviews: 88, bedrooms: 1, bathrooms: 2, guests: 3, area: 75,
    badge: "Disponible", type: "1 habitación",
    terrace: true, petFriendly: true, furnished: true, seaView: false,
    description: "Suite ejecutiva con terraza ajardinada en condominio cerrado. Acabados premium, sala amplia y zona de oficina dedicada.",
    features: ["WiFi", "A/C", "Cocina equipada", "Estacionamiento", "Piscina", "Gimnasio", "Seguridad 24h", "Lavandería", "Balcón", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1600585154340-be6161a56a0c"), u("photo-1505693416388-ac5ce068fe85"), u("photo-1560448204-e02f11c3d0e2"), u("photo-1493809842364-78817add7ffb"), u("photo-1600566753190-17f0baa2a6c3")],
    cert: baseCert(), hostInitials: "ES",
  },
  {
    id: "7",
    name: "Apartamento San Borja Premium",
    district: "San Borja", city: "Lima", address: "Av. San Borja Norte 967",
    price: 580,
    rating: 4.8, reviews: 64, bedrooms: 1, bathrooms: 1, guests: 2, area: 58,
    badge: "Nuevo", type: "1 habitación",
    terrace: false, petFriendly: true, furnished: true, seaView: false,
    description: "Apartamento moderno en una de las zonas más conectadas de Lima. Ideal para profesionales y estadías ejecutivas. Edificio con seguridad 24h.",
    features: ["WiFi", "A/C", "Cocina equipada", "Estacionamiento", "Seguridad 24h", "Lavandería", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1505691938895-1758d7feb511"), u("photo-1502672260266-1c1ef2d93688"), u("photo-1522708323590-d24dbb6b0267"), u("photo-1560185007-cde436f6a4d0"), u("photo-1493809842364-78817add7ffb")],
    cert: { ...baseCert(), equipamiento: 9.0 }, hostInitials: "ES",
  },
  {
    id: "8",
    name: "Loft Magdalena del Mar",
    district: "Magdalena", city: "Lima", address: "Jr. Leoncio Prado 431",
    price: 530,
    rating: 4.7, reviews: 51, bedrooms: 1, bathrooms: 1, guests: 2, area: 55,
    badge: "Última unidad", type: "1 habitación",
    terrace: true, petFriendly: true, furnished: true, seaView: true,
    description: "Loft con balcón y vista parcial al mar. Edificio nuevo con áreas comunes y servicio de portería 24/7.",
    features: ["WiFi", "A/C", "Cocina equipada", "Estacionamiento", "Seguridad 24h", "Lavandería", "Balcón", "Smart TV", "Agua caliente", "Ascensor"],
    images: [u("photo-1600210492486-724fe5c67fb0"), u("photo-1600566753190-17f0baa2a6c3"), u("photo-1505691938895-1758d7feb511"), u("photo-1560185007-cde436f6a4d0"), u("photo-1493809842364-78817add7ffb")],
    cert: baseCert(), hostInitials: "ES",
  },
];

export const getListing = (id: string) => listings.find((l) => l.id === id);

/** Max stay 60 nights per Easy Stay policy */
export const MAX_NIGHTS = 60;
export const MIN_NIGHTS = 1;
export const CLEANING_FEE_USD = 80;
export const SERVICE_FEE_RATE = 0.1;
export const IGV_RATE = 0.18;

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (isNaN(a) || isNaN(b) || b <= a) return 0;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export type CostBreakdown = {
  nights: number;
  base: number;
  cleaning: number;
  service: number;
  igv: number;
  total: number;
};

export function computeCost(pricePerNight: number, nights: number): CostBreakdown {
  if (nights <= 0) return { nights: 0, base: 0, cleaning: 0, service: 0, igv: 0, total: 0 };
  const base = pricePerNight * nights;
  const cleaning = CLEANING_FEE_USD;
  const service = Math.round(base * SERVICE_FEE_RATE);
  const subtotal = base + cleaning + service;
  const igv = Math.round(subtotal * IGV_RATE);
  const total = subtotal + igv;
  return { nights, base, cleaning, service, igv, total };
}

export const fmtUSD = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

