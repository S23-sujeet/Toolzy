import { Link } from 'react-router-dom';
import { getToolBadgeStyles, type ToolDefinition } from '../lib/tools';
import { ArrowRightIcon } from './icons';

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  const styles = getToolBadgeStyles(tool);

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-premium-lg sm:p-6"
    >
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${styles.icon} text-white shadow-sm transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12`}
      >
        <Icon className="h-5.5 w-5.5 sm:h-6 sm:w-6" strokeWidth={1.8} />
      </div>
      <span
        className={`absolute right-5 top-5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles.badge}`}
      >
        {styles.label}
      </span>
      <h3 className="font-semibold text-slate-800">{tool.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tool.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
        Open tool <ArrowRightIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}
