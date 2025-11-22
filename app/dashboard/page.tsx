"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";

type LinkItem = {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  isAnonymous?: boolean;
};

type GuestDialogState = {
  code: string;
  shortUrl: string;
  targetUrl: string;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const isAuthed = !!session?.user;
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState("");
  const [guestDialog, setGuestDialog] = useState<GuestDialogState | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const fetchLinks = useCallback(async () => {
    if (!isAuthed) {
      setLinks([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setTableError("");
      const res = await fetch("/api/links");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load links");
      }
      const data: LinkItem[] = await res.json();
      setLinks(data);
    } catch (err: any) {
      console.error("Load links error:", err);
      setTableError(err.message || "Failed to load links");
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // When user logs in, claim any pending guest links from localStorage
  useEffect(() => {
    if (!isAuthed) return;
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("tinylink_pending_claim");
    if (!stored) return;

    let codes: string[] = [];
    try {
      codes = JSON.parse(stored);
    } catch {
      codes = [];
    }
    if (!codes.length) return;

    (async () => {
      try {
        await fetch("/api/links/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codes }),
        });
      } catch (e) {
        console.error("Claim links error", e);
      } finally {
        window.localStorage.removeItem("tinylink_pending_claim");
        fetchLinks();
      }
    })();
  }, [isAuthed, fetchLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setCreateError("URL must start with http:// or https://");
      setCreating(false);
      return;
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      setCreateError("Custom code must be 6–8 alphanumeric characters.");
      setCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: url, code: code || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      const createdShortUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/${data.code}`
          : `/${data.code}`;

      // Reset form
      setUrl("");
      setCode("");

      if (isAuthed) {
        // Just reload links for logged-in user
        fetchLinks();
      } else {
        // Guest: show dialog + store code to claim later
        setGuestDialog({
          code: data.code,
          shortUrl: createdShortUrl,
          targetUrl: data.targetUrl,
        });

        if (typeof window !== "undefined") {
          try {
            const raw = window.localStorage.getItem(
              "tinylink_pending_claim"
            );
            const existing: string[] = raw ? JSON.parse(raw) : [];
            if (!existing.includes(data.code)) {
              existing.push(data.code);
              window.localStorage.setItem(
                "tinylink_pending_claim",
                JSON.stringify(existing)
              );
            }
          } catch (e) {
            console.error("Unable to store guest codes", e);
          }
        }
      }
    } catch (err: any) {
      console.error("Create link error:", err);
      setCreateError(err.message || "Failed to create link");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (linkCode: string) => {
    setDeletingCode(linkCode);
    setTableError("");

    try {
      const res = await fetch(`/api/links/${linkCode}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete link");
      }
      setLinks((prev) => prev.filter((l) => l.code !== linkCode));
    } catch (err: any) {
      console.error("Delete link error:", err);
      setTableError(err.message || "Failed to delete link");
    } finally {
      setDeletingCode(null);
    }
  };

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleString();
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Create & manage your TinyLinks.
        </p>
      </div>

      {/* Create Link Form (always available) */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/70"
      >
        <h2 className="text-sm font-semibold mb-4">Create a new short link</h2>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Destination URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/something"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Custom code (optional)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6–8 characters"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <p className="text-[11px] text-slate-400">
              If left empty, a random code will be generated.
            </p>
          </div>
        </div>

        {createError && (
          <p className="mt-3 text-xs text-red-500 font-medium">{createError}</p>
        )}

        <button
          type="submit"
          disabled={creating}
          className="mt-4 rounded-xl bg-linear-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create link"}
        </button>
      </form>

      {/* Your links section */}
      {isAuthed ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h2 className="text-sm font-semibold">Your links</h2>
          </div>

          {tableError && (
            <p className="mb-3 text-xs text-red-500 font-medium">
              {tableError}
            </p>
          )}

          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading links…
            </div>
          ) : links.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No links yet. Create your first one above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-slate-200/80 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="py-2 pr-4">Code</th>
                    <th className="py-2 pr-4">Short URL</th>
                    <th className="py-2 pr-4">Target URL</th>
                    <th className="py-2 pr-4 text-right">Clicks</th>
                    <th className="py-2 pr-4">Last clicked</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                  {links.map((link) => {
                    const shortUrl = `${baseUrl}/${link.code}`;
                    return (
                      <tr key={link.id} className="align-middle">
                        <td className="py-2 pr-4 font-mono text-[11px] text-slate-200">
                          {link.code}
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(shortUrl)}
                              className="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-[11px] text-slate-700 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                              Copy
                            </button>
                            <a
                              href={shortUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate max-w-[180px] text-[11px] text-brand-300 hover:underline"
                            >
                              {shortUrl}
                            </a>
                          </div>
                        </td>
                        <td className="py-2 pr-4">
                          <span className="truncate max-w-[260px] inline-block text-[11px] text-slate-300">
                            {link.targetUrl}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right text-[11px]">
                          {link.totalClicks}
                        </td>
                        <td className="py-2 pr-4 text-[11px] text-slate-400">
                          {formatDateTime(link.lastClickedAt)}
                        </td>
                        <td className="py-2 pr-0 text-right">
                          <div className="flex justify-end gap-2">
                            <a
                              href={`/code/${link.code}`}
                              className="rounded-full border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                            >
                              Stats
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDelete(link.code)}
                              disabled={deletingCode === link.code}
                              className="rounded-full border border-red-400/60 px-2 py-1 text-[11px] text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                            >
                              {deletingCode === link.code
                                ? "Deleting…"
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-sm font-semibold mb-2">Your links</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 max-w-md">
            You created a link as a guest. To see your full link history,
            analytics and manage links, please log in.
          </p>
          <button
            onClick={() => signIn("github")}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            Login to unlock dashboard
          </button>
        </div>
      )}

      {/* Guest dialog after creating a link */}
      {!isAuthed && guestDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-white mb-2">
              Your link is ready
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              This link will work for <strong>30 days</strong>. Log in to save
              it to your account and unlock analytics & dashboards.
            </p>

            <div className="rounded-xl bg-slate-900 px-3 py-2 mb-3">
              <p className="text-[11px] text-slate-400 mb-1">Short URL</p>
              <div className="flex items-center gap-2">
                <span className="flex-1 truncate text-xs text-slate-100">
                  {guestDialog.shortUrl}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(guestDialog.shortUrl)}
                  className="rounded-full border border-slate-600 px-3 py-1 text-[11px] text-slate-100"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <button
                type="button"
                onClick={() => setGuestDialog(null)}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => signIn("github")}
                className="rounded-full bg-linear-to-r from-brand-500 to-brand-600 px-4 py-1.5 text-xs font-semibold text-white"
              >
                Login & save this link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
