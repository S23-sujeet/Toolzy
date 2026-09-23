import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon, CloseIcon, LogoMark, MenuIcon, SparklesIcon } from './icons';
import { SECTIONS } from '../lib/tools';

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change so navigating never leaves a stale panel open.
  useEffect(() => {
    setCategoriesOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!categoriesOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setCategoriesOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCategoriesOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [categoriesOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? 'border-slate-200 shadow-sm' : 'border-slate-200/70'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-3.5">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-base font-bold tracking-tight whitespace-nowrap text-slate-800 sm:gap-2.5 sm:text-lg"
        >
          <LogoMark className="h-7 w-7 sm:h-8 sm:w-8" />
          Toolzy
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen((v) => !v)}
              aria-expanded={categoriesOpen}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 ${
                categoriesOpen ? 'bg-slate-100 text-slate-900' : ''
              }`}
            >
              Categories
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-1/2 z-50 mt-2 w-[640px] max-w-[90vw] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 shadow-premium-lg">
                <div className="grid grid-cols-2 gap-1">
                  {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Link
                        key={section.id}
                        to={section.path}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${section.iconGradient} text-white shadow-sm`}
                        >
                          <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-800">{section.shortLabel}</span>
                          <span className="block truncate text-xs text-slate-400">{section.description}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link to="/#tools" className="rounded-lg px-3 py-2 whitespace-nowrap transition hover:bg-slate-100 hover:text-slate-900">
            All Tools
          </Link>
          <Link to="/about" className="rounded-lg px-3 py-2 whitespace-nowrap transition hover:bg-slate-100 hover:text-slate-900">
            About
          </Link>

          <Link
            to="/premium"
            className="ml-2 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-3.5 py-2 text-sm whitespace-nowrap text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
          >
            <SparklesIcon className="h-4 w-4 shrink-0" />
            Support Toolzy
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-1.5 md:hidden">
          <Link
            to="/premium"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
          >
            <SparklesIcon className="h-4 w-4 shrink-0" />
            Support
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-slate-200 bg-white px-3 py-3 md:hidden">
          <Link to="/#tools" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            All Tools
          </Link>
          <Link to="/about" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            About
          </Link>
          <p className="mt-2 mb-1 px-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">Categories</p>
          <div className="grid grid-cols-1 gap-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  to={section.path}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${section.iconGradient} text-white`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  {section.shortLabel}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
