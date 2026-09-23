import { Link } from 'react-router-dom';
import { SECTIONS, getToolsBySection } from '../lib/tools';
import { BoltIcon, LogoMark, ShieldCheckIcon, SparklesIcon } from './icons';

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-slate-900 text-slate-300">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <LogoMark className="h-8 w-8" />
              Toolzy
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Every everyday tool you need - PDFs, converters, calculators and more - free, fast and 100% private.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-400" />
                Nothing you enter ever leaves your device.
              </span>
              <span className="flex items-center gap-1.5">
                <BoltIcon className="h-4 w-4 shrink-0 text-amber-400" />
                Instant, in-browser processing - no waiting on servers.
              </span>
            </div>
            <Link
              to="/premium"
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
            >
              <SparklesIcon className="h-4 w-4" />
              Support Toolzy
            </Link>
          </div>

          {SECTIONS.map((section) => {
            const tools = getToolsBySection(section.id);
            return (
              <div key={section.id}>
                <h4 className="text-sm font-semibold text-white">{section.shortLabel}</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  {tools.slice(0, 5).map((t) => (
                    <li key={t.slug}>
                      <Link to={`/tools/${t.slug}`} className="transition hover:text-brand-400">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to={section.path} className="font-medium text-brand-400 transition hover:text-brand-300">
                      View all {tools.length} tools
                    </Link>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Toolzy. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/about" className="transition hover:text-brand-400">
              About
            </Link>
            <Link to="/privacy" className="transition hover:text-brand-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-brand-400">
              Terms of Service
            </Link>
          </nav>
          <p>Built with React, pdf-lib &amp; pdf.js.</p>
        </div>
      </div>
    </footer>
  );
}
