import { useCallback, useEffect, useState } from "react";

const DISMISS_KEY = "moneylog.install.dismissed";

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      try {
        if (localStorage.getItem(DISMISS_KEY) === "1") return;
      } catch {}
      setDeferredPrompt(e);
    };
    const onInstalled = () => setInstalled(true);
    const onDisplayMode = (e) => setInstalled(e.matches);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    const mql = window.matchMedia?.("(display-mode: standalone)");
    mql?.addEventListener?.("change", onDisplayMode);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      mql?.removeEventListener?.("change", onDisplayMode);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice?.outcome === "accepted") {
      setInstalled(true);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setDismissed(true);
    setDeferredPrompt(null);
  }, []);

  const canInstall = !!deferredPrompt && !installed && !dismissed;

  return { canInstall, install, dismiss, installed };
}