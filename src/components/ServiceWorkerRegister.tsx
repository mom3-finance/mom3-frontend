"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        registration.update();
      })
      .catch((error) => {
        console.error("[PWA] Service worker registration failed:", error);
      });
  }, []);

  return null;
}
