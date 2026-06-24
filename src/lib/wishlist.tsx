import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Ctx = {
  ids: Set<string>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

const WishlistCtx = createContext<Ctx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const has = useCallback((id: string) => ids.has(id), [ids]);
  return <WishlistCtx.Provider value={{ ids, toggle, has }}>{children}</WishlistCtx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistCtx);
  if (!ctx) throw new Error("useWishlist outside provider");
  return ctx;
}
