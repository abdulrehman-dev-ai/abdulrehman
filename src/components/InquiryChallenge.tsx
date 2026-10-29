"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileClient = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileClient;
  }
}

export default function InquiryChallenge({
  siteKey,
  onToken,
  resetNonce,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  resetNonce: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const api = window.turnstile;
    const node = container.current;
    if (!scriptReady || !api || !node || widgetId.current !== null) return;

    widgetId.current = api.render(node, {
      sitekey: siteKey,
      theme: "dark",
      size: "flexible",
      callback: (token: string) => {
        setError(false);
        onToken(token);
      },
      "expired-callback": () => onToken(""),
      "error-callback": () => {
        onToken("");
        setError(true);
      },
    });

    return () => {
      if (widgetId.current !== null && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, [scriptReady, siteKey, onToken]);

  useEffect(() => {
    if (resetNonce > 0 && widgetId.current !== null && window.turnstile) {
      onToken("");
      window.turnstile.reset(widgetId.current);
    }
  }, [resetNonce, onToken]);

  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setError(true)}
      />
      <div ref={container} aria-label="Spam prevention verification" />
      {error && <p role="alert">Verification is unavailable. Please use the email option below.</p>}
    </div>
  );
}
