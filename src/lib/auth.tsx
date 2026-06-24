import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  name: string;
  email: string;
  phone: string;
  dni?: string;
  photo?: string;
  birthDate?: string;
  district?: string;
};

export type Reservation = {
  id: string;
  code: string;
  userEmail: string;
  listingId: string;
  listingName: string;
  district: string;
  image: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: "Activa" | "En revisión" | "Finalizada";
  createdAt: string;
};

type AuthCtx = {
  isLoggedIn: boolean;
  currentUser: AuthUser | null;
  reservations: Reservation[];
  login: (u: AuthUser) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  register: (u: AuthUser & { password: string }) => void;
  logout: () => void;
  addReservation: (r: Omit<Reservation, "userEmail">) => void;
  updateUser: (u: Partial<AuthUser> & { password?: string }) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const USER_KEY = "easystay_user";
const RES_KEY = "easystay_reservations";
const USERS_KEY = "easystay_users";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const loadReservationsFor = (email: string | null): Reservation[] => {
    if (!email) return [];
    try {
      const all = JSON.parse(localStorage.getItem(RES_KEY) || "[]") as Reservation[];
      return all.filter((r) => r.userEmail === email);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_KEY);
      const parsed = u ? (JSON.parse(u) as AuthUser) : null;
      if (parsed) setCurrentUser(parsed);
      setReservations(loadReservationsFor(parsed?.email ?? null));
    } catch {}
  }, []);

  const persistUser = (u: AuthUser | null) => {
    setCurrentUser(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
    setReservations(loadReservationsFor(u?.email ?? null));
  };

  const login = (u: AuthUser) => persistUser(u);

  const loginWithCredentials = (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as Array<AuthUser & { password: string }>;
      const found = users.find((x) => x.email === email && x.password === password);
      if (found) {
        const { password: _p, ...rest } = found;
        persistUser(rest);
        return true;
      }
    } catch {}
    return false;
  };

  const register = (u: AuthUser & { password: string }) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as Array<AuthUser & { password: string }>;
      const filtered = users.filter((x) => x.email !== u.email);
      filtered.push(u);
      localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    } catch {}
    const { password: _p, ...rest } = u;
    persistUser(rest);
  };

  const logout = () => persistUser(null);

  const addReservation = (r: Omit<Reservation, "userEmail">) => {
    if (!currentUser) return;
    const tagged: Reservation = { ...r, userEmail: currentUser.email };
    try {
      const all = JSON.parse(localStorage.getItem(RES_KEY) || "[]") as Reservation[];
      localStorage.setItem(RES_KEY, JSON.stringify([tagged, ...all]));
    } catch {}
    setReservations((prev) => [tagged, ...prev]);
  };

  const updateUser = (u: Partial<AuthUser> & { password?: string }) => {
    if (!currentUser) return;
    const { password, ...rest } = u;
    const next = { ...currentUser, ...rest };
    persistUser(next);
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as Array<AuthUser & { password: string }>;
      const idx = users.findIndex((x) => x.email === currentUser.email);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...rest, email: next.email, ...(password ? { password } : {}) };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch {}
  };

  return (
    <Ctx.Provider
      value={{
        isLoggedIn: !!currentUser,
        currentUser,
        reservations,
        login,
        loginWithCredentials,
        register,
        logout,
        addReservation,
        updateUser,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
