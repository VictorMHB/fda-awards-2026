"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function OfflineToast() {
  useEffect(() => {
    const goOffline = () => toast.warning("Sem conexão — suas escolhas serão salvas ao reconectar.");
    const goOnline = () => toast.success("Conexão restabelecida.");
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return null;
}