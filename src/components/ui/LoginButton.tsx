"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function LoginButton() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    } catch (err) {
      console.error("Erro ao fazer login:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/session", { method: "DELETE" });
    await signOut(auth);
  };

  if (loading) return null;

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user.photoURL && (
          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" width={32} height={32} style={{ borderRadius: "50%" }} />
        )}
        <span>{user.displayName}</span>
        <button onClick={handleLogout}>Sair</button>
      </div>
    );
  }

  return <button onClick={handleLogin}>Entrar com Google</button>;
}