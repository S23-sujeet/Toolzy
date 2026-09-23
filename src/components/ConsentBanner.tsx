import { Link } from 'react-router-dom';
import { useAdConsent } from '../context/AdConsentContext';
import { SITE_NAME } from '../lib/seo';

/** Shown until the visitor makes an ad-cookie choice; no ad script loads before that (see AdSlot). */
export default function ConsentBanner() {
  const { consent, setConsent } = useAdConsent();
  if (consent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-600">
          {SITE_NAME} is free and supported by ads. We use cookies to show ads, which may be personalized based on
          your visits. See our{' '}
          <Link to="/privacy" className="text-brand-600 underline hover:text-brand-700">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent('non-personalized')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Reject personalization
          </button>
          <button
            type="button"
            onClick={() => setConsent('personalized')}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
