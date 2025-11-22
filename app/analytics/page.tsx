"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import type { CSSProperties } from "react";

// ----- Mock analytics data -----

type RangeKey = "overall" | "30d" | "7d";

type SummaryStats = {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  avgClicksPerLink: number;
};

type CountryStats = { country: string; code: string; clicks: number; percent: number };

type DeviceStats = { name: string; percent: number };

type TimelinePoint = { label: string; clicks: number };

const ANALYTICS_DATA: Record<
  RangeKey,
  {
    summary: SummaryStats;
    topCountries: CountryStats[];
    devices: DeviceStats[];
    timeline: TimelinePoint[];
  }
> = {
  overall: {
    summary: {
      totalLinks: 248,
      totalClicks: 18240,
      activeLinks: 196,
      avgClicksPerLink: 73.6,
    },
    topCountries: [
      { country: "United States", code: "US", clicks: 7200, percent: 39 },
      { country: "India", code: "IN", clicks: 5200, percent: 29 },
      { country: "Germany", code: "DE", clicks: 1800, percent: 10 },
      { country: "Brazil", code: "BR", clicks: 1500, percent: 8 },
      { country: "Others", code: "OTH", clicks: 2540, percent: 14 },
    ],
    devices: [
      { name: "Windows", percent: 38 },
      { name: "Android", percent: 27 },
      { name: "macOS", percent: 18 },
      { name: "iOS", percent: 12 },
      { name: "Linux", percent: 3 },
      { name: "Other", percent: 2 },
    ],
    timeline: [
      { label: "Jan", clicks: 1200 },
      { label: "Feb", clicks: 1420 },
      { label: "Mar", clicks: 1680 },
      { label: "Apr", clicks: 1950 },
      { label: "May", clicks: 2100 },
      { label: "Jun", clicks: 2300 },
    ],
  },
  "30d": {
    summary: {
      totalLinks: 42,
      totalClicks: 3840,
      activeLinks: 39,
      avgClicksPerLink: 91.4,
    },
    topCountries: [
      { country: "India", code: "IN", clicks: 1700, percent: 44 },
      { country: "United States", code: "US", clicks: 1100, percent: 29 },
      { country: "United Kingdom", code: "GB", clicks: 420, percent: 11 },
      { country: "Singapore", code: "SG", clicks: 260, percent: 7 },
      { country: "Others", code: "OTH", clicks: 360, percent: 9 },
    ],
    devices: [
      { name: "Android", percent: 34 },
      { name: "Windows", percent: 30 },
      { name: "iOS", percent: 18 },
      { name: "macOS", percent: 12 },
      { name: "Linux", percent: 4 },
      { name: "Other", percent: 2 },
    ],
    timeline: [
      { label: "Day -30", clicks: 80 },
      { label: "Day -24", clicks: 110 },
      { label: "Day -18", clicks: 140 },
      { label: "Day -12", clicks: 190 },
      { label: "Day -6", clicks: 220 },
      { label: "Today", clicks: 260 },
    ],
  },
  "7d": {
    summary: {
      totalLinks: 12,
      totalClicks: 980,
      activeLinks: 11,
      avgClicksPerLink: 81.7,
    },
    topCountries: [
      { country: "India", code: "IN", clicks: 420, percent: 43 },
      { country: "United States", code: "US", clicks: 260, percent: 27 },
      { country: "United Kingdom", code: "GB", clicks: 120, percent: 12 },
      { country: "Others", code: "OTH", clicks: 180, percent: 18 },
    ],
    devices: [
      { name: "Android", percent: 38 },
      { name: "Windows", percent: 26 },
      { name: "iOS", percent: 20 },
      { name: "macOS", percent: 10 },
      { name: "Linux", percent: 4 },
      { name: "Other", percent: 2 },
    ],
    timeline: [
      { label: "Mon", clicks: 110 },
      { label: "Tue", clicks: 130 },
      { label: "Wed", clicks: 150 },
      { label: "Thu", clicks: 135 },
      { label: "Fri", clicks: 170 },
      { label: "Sat", clicks: 180 },
      { label: "Sun", clicks: 105 },
    ],
  },
};

// ----- UI helpers -----

const rangeLabels: Record<RangeKey, string> = {
  overall: "Overview",
  "30d": "Last 30 days",
  "7d": "Last 7 days",
};

function formatNumber(n: number) {
  return n.toLocaleString();
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [range, setRange] = useState<RangeKey>("overall");

  if (status === "loading") {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }
  const data = ANALYTICS_DATA[range];

  const maxTimeline =
    data.timeline.length > 0
      ? Math.max(...data.timeline.map((p) => p.clicks))
      : 1;

      if (!session?.user) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <h1 className="text-lg font-semibold">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center">
          Analytics are available for logged-in users only. Guest links are
          temporary and only support basic redirection.
        </p>
        <button
          onClick={() => signIn("github")}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          Login to view analytics
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Visual overview of how your TinyLinks are performing.
          </p>
        </div>

        {/* Range toggle */}
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 text-[11px] shadow-soft dark:border-slate-800 dark:bg-slate-900/70">
          {(["overall", "30d", "7d"] as RangeKey[]).map((key) => {
            const active = range === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`rounded-full px-3 py-1 transition ${
                  active
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {rangeLabels[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Total links created"
          value={formatNumber(data.summary.totalLinks)}
        />
        <SummaryCard
          label="Total clicks"
          value={formatNumber(data.summary.totalClicks)}
        />
        <SummaryCard
          label="Active links"
          value={formatNumber(data.summary.activeLinks)}
        />
        <SummaryCard
          label="Avg clicks per link"
          value={data.summary.avgClicksPerLink.toFixed(1)}
        />
      </div>

      {/* Map + Devices */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* World map */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 shadow-soft dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Geographic distribution
              </p>
              <p className="text-sm font-semibold text-white mt-1">
                Clicks by country
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              Top countries • {rangeLabels[range]}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-center">
            <div className="relative aspect-[16/7] overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
              <img
                src="/world-map.svg"
                alt="World map"
                className="h-full w-full object-cover opacity-70"
              />

              {/* Hotspots for top countries (visual only) */}
              <MapDot label="US" intensity={data.topCountries[0]?.code === "US" ? 1 : 0.4} style={{ top: "32%", left: "22%" }} />
              <MapDot label="IN" intensity={data.topCountries[0]?.code === "IN" ? 1 : 0.6} style={{ top: "52%", left: "60%" }} />
              <MapDot label="DE" intensity={0.5} style={{ top: "32%", left: "40%" }} />
              <MapDot label="BR" intensity={0.5} style={{ top: "62%", left: "30%" }} />
              <MapDot label="SG" intensity={0.4} style={{ top: "62%", left: "68%" }} />
            </div>

            <div className="space-y-2">
              {data.topCountries.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-900/40 px-3 py-2 text-[11px] text-slate-200 ring-1 ring-slate-800/80"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{c.country}</span>
                    <span className="text-slate-400">
                      {formatNumber(c.clicks)} clicks
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-brand-400 to-brand-600"
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                    <span className="w-10 text-right">{c.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Devices card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Device breakdown
          </p>
          <p className="mt-1 text-sm font-semibold">Clicks by platform</p>

          <div className="mt-4 space-y-2">
            {data.devices.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-300">
                    {d.name}
                  </span>
                  <span className="text-slate-600 dark:text-slate-200">
                    {d.percent}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
            Based on anonymised click metadata. For the assignment, this is
            simulated data to demonstrate the UI.
          </p>
        </div>
      </div>

      {/* Timeline / activity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Activity
            </p>
            <p className="text-sm font-semibold">Clicks over time</p>
          </div>
          <p className="text-[11px] text-slate-400">
            {rangeLabels[range]}
          </p>
        </div>

        {data.timeline.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No data for this range yet.
          </div>
        ) : (
          <div className="mt-4">
            {/* Simple custom mini chart using divs */}
            <div className="flex h-32 items-end gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
              {data.timeline.map((p) => {
                const height = (p.clicks / maxTimeline) * 100;
                return (
                  <div
                    key={p.label}
                    className="flex flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-brand-500 to-brand-300"
                      style={{ height: `${Math.max(height, 6)}%` }}
                    />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----- Small sub-components -----

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function MapDot({
  label,
  intensity,
  style,
}: {
  label: string;
  intensity: number;
  style: React.CSSProperties;
}) {
  const alpha = 0.25 + intensity * 0.45;
  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
      style={style}
    >
      <div
        className="h-3 w-3 rounded-full bg-brand-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]"
        style={{ opacity: alpha }}
      />
      <span className="text-[9px] text-slate-300">{label}</span>
    </div>
  );
}
