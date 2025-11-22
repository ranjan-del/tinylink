# TinyLink – Modern URL Shortener & Analytics Dashboard

TinyLink is a full-stack URL shortener built with **Next.js App Router**, **Prisma + Neon Postgres**, **NextAuth**, and **Tailwind CSS**.

It supports:

- Short link creation (with optional custom codes)
- Click tracking & per-link stats
- Guest (anonymous) users with 30-day temporary links
- Logged-in users with a dashboard and analytics
- Dark/light theme, QR codes, and a modern, clean UI

---

## ✨ Features

### Core URL Shortener

- **Create short links**
  - Auto-generated or **custom codes** (6–8 alphanumeric characters)
  - URL validation (must start with `http://` or `https://`)
- **Redirects**
  - `/:code` → 302 redirect to the destination URL
  - Increments `totalClicks` and sets `lastClickedAt`
- **Per-link stats**
  - `/code/:code` shows:
    - Short URL
    - Target URL
    - Total clicks
    - Last clicked time
    - Created at
  - Includes a **QR code** and **copy** button

### Guest vs Logged-in Users

- **Guest users (no login)**
  - Can create links from the dashboard
  - After creating a link, a modal shows:
    - Short URL
    - Copy button
    - Message: valid for 30 days
    - “Login & save this link” button
  - Links are stored as **anonymous** with an `expiresAt` = now + 30 days
  - Dashboard table is hidden; instead a “Login to unlock dashboard” card is shown
  - `/analytics` is not accessible (prompt to log in)

- **Logged-in users**
  - Login via **GitHub OAuth** (NextAuth)
  - Links are saved with `userId` and **do not expire**
  - `/dashboard` shows:
    - Table of your links only
    - Copy short URL
    - Stats link for each entry
    - Delete link
  - `/analytics` shows a full analytics dashboard UI
  - When you log in after creating guest links, they are **claimed** into your account using `/api/links/claim`

### Link Expiry & “Smart 404”

- If a user visits `/:code` and:
  - The code **does not exist** → they are redirected to `/link-not-found?code=...&reason=notfound`
  - The link **has expired** → redirected to `/link-not-found?code=...&reason=expired`
- `/link-not-found`:
  - Shows a friendly message (“This TinyLink doesn’t exist yet / has expired”)
  - Prefills the requested code
  - Allows instant creation of a new link with that code
  - Shows short URL + copy button after creation
  - Prompts user to log in to keep links & access analytics

### Analytics Dashboard (UI Prototype)

- `/analytics` (for logged-in users) shows:
  - Summary cards:
    - Total links
    - Total clicks
    - Active links
    - Avg clicks per link
  - Time range toggle:
    - **Overview / Last 30 days / Last 7 days**
  - **World map** card with top countries list (mocked data)
  - **Device breakdown** (Windows, macOS, Linux, Android, iOS, Other – mocked)
  - Simple “Clicks over time” mini chart
- **Note:** For the assignment, analytics uses **simulated data** to demonstrate UI/UX. Real click events could be stored and aggregated in a future iteration.

### Health Check

- `/healthz`
  - Returns a simple JSON response (e.g. `{ ok: true, version: "1.0" }`)
  - Useful for monitoring and automated checks

### UI & UX

- **Next.js App Router**, React Server Components
- **Tailwind CSS** for styling
- **Dark / light theme toggle** with a sun/moon icon
- Consistent color theme and premium-style cards
- Mobile-friendly navigation:
  - Top bar + hamburger to open the left nav on small screens

---

## 🧱 Tech Stack

- **Frontend / Fullstack**
  - [Next.js 16](https://nextjs.org/) (App Router, server routes, RSC)
  - React, TypeScript
  - Tailwind CSS
- **Database & ORM**
  - [Neon](https://neon.tech/) (serverless Postgres)
  - [Prisma ORM](https://www.prisma.io/) (v7, `prisma-client-js`)
- **Authentication**
  - [NextAuth (Auth.js)](https://authjs.dev/) with Prisma adapter
  - GitHub OAuth login
- **Other**
  - `react-qr-code` for QR generation
  - `@prisma/adapter-neon` for Prisma + Neon
  - Deployed on **Vercel**

---

## 🗂 Project Structure (Key Files)

```txt
app/
  layout.tsx            # Root layout (ThemeProvider, SessionProvider, TopNav)
  page.tsx              # Landing / home page
  dashboard/
    page.tsx            # Main dashboard (create, list, delete links)
  analytics/
    page.tsx            # Analytics UI (mocked data, auth required)
  code/[code]/
    page.tsx            # Per-link stats page
  [code]/
    route.ts            # Redirect handler for /:code
  link-not-found/
    page.tsx            # Nice page when code doesn't exist/expired
  api/
    auth/[...nextauth]/
      route.ts          # NextAuth API handler
    links/
      route.ts          # POST (create link), GET (list links for user)
    links/[code]/
      route.ts          # GET (single link stats), DELETE (delete link)
    links/claim/
      route.ts          # POST (claim guest links for logged-in user)
    healthz/
      route.ts          # Health check

auth/
  auth.ts               # NextAuth configuration (providers, callbacks)
  helpers.ts            # getServerSession helper (if used)

components/
  top-nav.tsx           # Top navigation bar (brand, nav links, theme, auth)
  theme-provider.tsx    # Dark/light theme context
  session-provider.tsx  # NextAuth SessionProvider wrapper
  qr-card.tsx           # QR code card for stats page
  ...                   # Other UI helpers

lib/
  prisma.ts             # Prisma client with Neon adapter

prisma/
  schema.prisma         # Prisma schema (User, Account, Session, Link, etc.)

prisma.config.ts        # Prisma 7 datasource config (uses DATABASE_URL)
