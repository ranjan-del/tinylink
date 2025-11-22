import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { TopNav } from "../components/top-nav";
import { SessionProvider } from "../components/session-provider";

export const metadata: Metadata = {
  title: "TinyLink",
  description: "A beautiful URL shortener dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
              <TopNav />
              <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
  