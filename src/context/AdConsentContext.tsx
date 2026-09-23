import { createContext, useContext, useState, type ReactNode } from 'react';

export type AdConsent = 'personalized' | 'non-personalized';

const STORAGE_KEY = 'toolzy-ad-consent';

interface AdConsentContextValue {
  /** null = visitor has not made a choice yet; no ad script is loaded until then. */
  consent: AdConsent | null;
  setConsent: (value: AdConsent) => void;
}

const AdConsentContext = createContext<AdConsentContextValue | null>(null);

function readStoredConsent(): AdConsent | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'personalized' || value === 'non-personalized' ? value : null;
}

export function AdConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<AdConsent | null>(readStoredConsent);

  const setConsent = (value: AdConsent) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsentState(value);
  };

  return <AdConsentContext.Provider value={{ consent, setConsent }}>{children}</AdConsentContext.Provider>;
}

export function useAdConsent(): AdConsentContextValue {
  const ctx = useContext(AdConsentContext);
  if (!ctx) throw new Error('useAdConsent must be used within an AdConsentProvider');
  return ctx;
}
