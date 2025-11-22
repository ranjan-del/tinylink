"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

type Toast = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

type QRCardProps = {
  shortUrl: string;
};

export function QRCard({ shortUrl }: QRCardProps) {
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", title: string, message: string) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = () => {
    try {
      const svg = document.getElementById("tinylink-qr") as SVGSVGElement | null;
      if (!svg) {
        showToast("error", "Failed", "QR code not found");
        return;
      }

      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "tinylink-qr.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("success", "Success", "QR code downloaded successfully");
    } catch (e) {
      console.error("QR download failed", e);
      showToast("error", "Failed", "Failed to download QR code");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      showToast("success", "Success", "URL copied to clipboard");
    } catch {
      showToast("error", "Failed", "Failed to copy URL");
    }
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="text-xs">{toast.message}</p>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/70 flex flex-col items-center gap-3">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-200">
          Share via QR code
        </p>

      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
        <QRCode
          id="tinylink-qr"
          value={shortUrl}
          size={140}
          style={{ height: "auto", maxWidth: "100%", width: "140px" }}
        />
      </div>

      <a href={shortUrl} target="_blank" rel="noreferrer" className="text-[11px] text-center text-blue-500 dark:text-blue-400 break-all px-2">
        {shortUrl}
      </a>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] text-slate-700 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Copy URL
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] text-slate-700 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Download QR
        </button>
      </div>
      </div>
    </>
  );
}
