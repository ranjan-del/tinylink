// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[2fr,1.5fr] items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-200 ring-1 ring-brand-500/30">
            TinyLink · Elegant URL shortener
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Shorten links with{" "}
            <span className="bg-linear-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
              precision & style
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Create branded short links, track performance with rich analytics,
            and manage your campaigns from a beautiful dashboard built just for
            this assignment.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:from-brand-400 hover:to-brand-500 transition-all"
            >
              Go to dashboard
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-colors"
            >
              View analytics
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-900/80 dark:to-slate-900/20 p-4 shadow-soft">
          <div className="mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            Quick preview
          </div>
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-1.5 w-20 rounded-full bg-brand-500/70" />
                <div className="h-1.5 w-32 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
              <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                124 clicks
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Today</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">42</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">7 days</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">287</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Active links</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">19</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Real numbers coming soon — this is just a visual preview. We'll
              wire it up to live data next.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
