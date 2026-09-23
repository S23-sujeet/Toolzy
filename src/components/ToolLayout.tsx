import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';
import Seo from './Seo';
import { ArrowRightIcon, ShieldCheckIcon } from './icons';

interface ToolLayoutProps {
  title: string;
  description: string;
  path: string;
  seoDescription?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children: ReactNode;
}

/**
 * Shared shell for every tool page. Ad slots are placed in dedicated zones
 * (top banner, bottom banner, side rail) that are physically separate from
 * the `children` interactive area, so ad rendering/loading can never cover
 * or block the dropzone, buttons, or progress state of a tool.
 */
export default function ToolLayout({ title, description, path, seoDescription, icon: Icon, children }: ToolLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white">
      <Seo title={title} description={seoDescription ?? description} path={path} />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400">
          <Link to="/" className="transition hover:text-brand-600">
            Home
          </Link>
          <ArrowRightIcon className="h-3.5 w-3.5" />
          <span className="truncate font-medium text-slate-600">{title}</span>
        </nav>

        <div className="mt-4 mb-6">
          <AdSlot slotId="tool-top-banner" size="leaderboard" className="h-[90px] w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px] lg:gap-8">
          <div className="min-w-0">
            <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-5 shadow-premium sm:p-6 md:p-8">
              <div className="flex items-start gap-3.5 sm:gap-4">
                {Icon && (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm sm:h-12 sm:w-12">
                    <Icon className="h-5.5 w-5.5 sm:h-6 sm:w-6" strokeWidth={1.8} />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">{title}</h1>
                  <p className="mt-1 text-sm text-slate-500 sm:text-base">{description}</p>
                </div>
              </div>
              <div className="mt-6">{children}</div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
              <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-500" />
              Processed locally in your browser - files are never uploaded.
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <AdSlot slotId="tool-sidebar" size="sidebar" />
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <AdSlot slotId="tool-bottom-banner" size="banner" className="h-[90px] w-full" />
        </div>
      </div>
    </div>
  );
}
