// src/app/login/page.tsx
export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-soft">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Sign in to access your TinyLink dashboard.
        </p>

        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/60 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/60 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-linear-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:from-brand-400 hover:to-brand-500 transition-all"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
          Auth will be wired later (NextAuth/Firebase). For now, this is a UI
          placeholder to show recruiters the flow.
        </p>
      </div>
    </div>
  );
}
