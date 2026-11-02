"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Guarda o uid confirmado como admin, não um boolean: ao trocar de conta o valor antigo não vale
  const [adminUid, setAdminUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Pergunta ao servidor se esta conta é admin (o uid do admin só existe lá)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    user
      .getIdToken()
      .then((token) =>
        fetch("/api/admin/me", { headers: { Authorization: `Bearer ${token}` } }),
      )
      .then((res) => (res.ok ? res.json() : { admin: false }))
      .then((data) => {
        if (!cancelled && data.admin === true) setAdminUid(user.uid);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isAdmin = user !== null && adminUid === user.uid;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}