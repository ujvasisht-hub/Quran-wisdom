import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function useRazorpay() {
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptReady(true));
      existingScript.addEventListener('error', () => {
        console.error('[Razorpay] Failed to load checkout script.');
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => {
      console.error('[Razorpay] Failed to load checkout script dynamically.');
    };
    document.head.appendChild(script);
  }, []);

  return { scriptReady };
}
