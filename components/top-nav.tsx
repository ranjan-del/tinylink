"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";


const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
];

export function TopNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* Top navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          {/* Left: hamburger (mobile) + logo/name */}
          <div className="flex items-center gap-3">
            {/* Hamburger only on mobile */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              aria-label="Open navigation"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>

            {/* Logo + name */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-soft">
                <span className="text-sm font-bold tracking-tight">T</span>
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="text-sm font-semibold tracking-tight">
                  TinyLink
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Premium URL shortener
                </div>
              </div>
            </div>
          </div>

          {/* Center: nav links (desktop only) */}
          <nav className="hidden md:flex items-center gap-1 text-sm mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: theme toggle, profile, login (login last) */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            {/* Profile avatar placeholder */}
            {session?.user ? (
              <>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
                >
                  {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                </button>

                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer nav */}
      {open && (
        <div className="fixed inset-0 z-30 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-950 text-slate-50 shadow-soft flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 text-white">
                  <span className="text-xs font-bold">T</span>
                </div>
                <span className="text-sm font-semibold">TinyLink</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-slate-700 text-slate-200"
                aria-label="Close navigation"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
