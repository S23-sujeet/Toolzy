import { useMemo, useState } from 'react';
import { CheckIcon, ShieldCheckIcon, SparklesIcon } from '../components/icons';
import Seo from '../components/Seo';

type Currency = 'USD' | 'INR';

// Legacy single-currency var still supported as a USD fallback.
const LEGACY_URL = (import.meta.env.VITE_SUPPORT_URL as string | undefined)?.trim();
const SUPPORT_URLS: Record<Currency, string | undefined> = {
  USD: (import.meta.env.VITE_SUPPORT_URL_USD as string | undefined)?.trim() || LEGACY_URL,
  INR: (import.meta.env.VITE_SUPPORT_URL_INR as string | undefined)?.trim(),
};

const CURRENCY_LABELS: Record<Currency, string> = { USD: '$ USD', INR: 'INR' };

const FEATURES = [
  'Keep every Toolzy tool free to use',
  'Help cover hosting and future improvements',
  'Support privacy-first, in-browser processing',
  'Make future tools and improvements possible',
];

// Best-effort locale guess (no network call) - user can still switch manually.
function detectDefaultCurrency(): Currency {
  try {
    const locale = navigator.language ?? '';
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (locale.toLowerCase().endsWith('-in') || timeZone === 'Asia/Kolkata' || timeZone === 'Asia/Calcutta') {
      return 'INR';
    }
  } catch {
    // Intl APIs unavailable - fall through to default.
  }
  return 'USD';
}

export default function Premium() {
  const availableCurrencies = useMemo(
    () => (Object.keys(SUPPORT_URLS) as Currency[]).filter((c) => SUPPORT_URLS[c]),
    [],
  );
  const [currency, setCurrency] = useState<Currency>(() => {
    const guess = detectDefaultCurrency();
    return SUPPORT_URLS[guess] ? guess : (availableCurrencies[0] ?? 'USD');
  });
  const supportUrl = SUPPORT_URLS[currency];

  return (
    <div className="bg-slate-50 py-16">
      <Seo
        title="Support Toolzy - Free Online Tools"
        description="Support Toolzy's free, privacy-first PDF tools, converters, calculators and text utilities."
        path="/premium"
      />
      <div className="mx-auto max-w-2xl px-4 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/25">
          <SparklesIcon className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Support Toolzy</h1>
        <p className="mt-3 text-slate-500">Toolzy is free to use and runs in your browser. If it saves you time, you can help keep it going.</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm">
          <ul className="space-y-3.5">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
                <span className="text-slate-600">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-slate-100 pt-6">
            {availableCurrencies.length > 1 && (
              <div className="mb-4 flex justify-center gap-2">
                {availableCurrencies.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                      currency === c
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {CURRENCY_LABELS[c]}
                  </button>
                ))}
              </div>
            )}
            {supportUrl ? (
              <a
                href={supportUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-600"
              >
                <ShieldCheckIcon className="h-5 w-5" />
                Support Toolzy ({CURRENCY_LABELS[currency]})
              </a>
            ) : (
              <p className="text-center text-sm text-slate-500">
                Support payments are not configured yet. Add <code>VITE_SUPPORT_URL_USD</code> and/or{' '}
                <code>VITE_SUPPORT_URL_INR</code> before deploying.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
