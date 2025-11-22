"use client";

import { signIn } from "next-auth/react";

export default function RedirectToLogin() {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <p className="text-sm text-slate-500">You must log in to continue.</p>
      <button
        onClick={() => signIn("github")}
        className="rounded-full border px-4 py-2 text-sm"
      >
        Login with GitHub
      </button>
    </div>
  );
}
