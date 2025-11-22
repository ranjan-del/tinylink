import Link from "next/link";

type LinkNotFoundPageProps = {
  searchParams: Promise<{ code?: string; reason?: string }>;
};

export default async function LinkNotFoundPage({
  searchParams,
}: LinkNotFoundPageProps) {
  const { code, reason } = await searchParams;
  const isExpired = reason === "expired";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30">
        <svg
          className="h-10 w-10 text-red-500 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {isExpired ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          )}
        </svg>
      </div>

      {/* Title */}
      <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
        {isExpired ? "Oops! This link has expired" : "Link not found"}
      </h1>

      {/* Description */}
      <p className="mb-2 max-w-md text-slate-600 dark:text-slate-400">
        {isExpired
          ? "This short link has reached its expiration date and is no longer active."
          : code
            ? `The short link "${code}" doesn't exist or may have been removed.`
            : "This short link doesn't exist or may have been removed."}
      </p>

      {/* Motivational text */}
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-500">
        {isExpired
          ? "Good things don't last forever, but you can create a fresh link in seconds!"
          : "No worries! Create your own short link right now — it only takes a moment."}
      </p>

      {/* CTA Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create Your Link Now
      </Link>

      {/* Secondary action */}
      <Link
        href="/"
        className="mt-4 text-sm text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
