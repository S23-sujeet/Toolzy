import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { ShieldCheckIcon, SparklesIcon } from '../components/icons';
import { SITE_NAME } from '../lib/seo';

export default function AboutUs() {
  return (
    <div className="bg-slate-50 py-12">
      <Seo
        title="About Us"
        description={`Why ${SITE_NAME} exists and how its free, in-browser tools work.`}
        path="/about"
      />
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">About {SITE_NAME}</h1>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-slate-600">
            {SITE_NAME} is a collection of free online tools - PDF utilities, converters, calculators, generators
            and developer utilities - built to solve everyday tasks quickly, without sign-ups or file uploads.
          </p>

          <div className="mt-6 flex items-start gap-3">
            <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-slate-600">
              Every tool runs entirely in your browser. Files and text you enter are processed on your own device
              and are never uploaded to a server, so nothing about your documents ever leaves your computer.
            </p>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <SparklesIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
            <p className="text-slate-600">
              {SITE_NAME} is free to use and supported by ads shown alongside the tools. If it saves you time, you
              can also{' '}
              <Link to="/premium" className="text-brand-600 underline hover:text-brand-700">
                support the project directly
              </Link>
              .
            </p>
          </div>

          <p className="mt-6 text-slate-600">
            Have feedback, found a bug, or want to suggest a new tool? Email{' '}
            <a href="mailto:support@toolzy.app" className="text-brand-600 underline hover:text-brand-700">
              support@toolzy.app
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
