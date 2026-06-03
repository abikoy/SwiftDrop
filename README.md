# 🚀 SwiftDrop

> **Fast delivery for anything you need.**
> A modern full-stack multi-service delivery web app built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Supabase.

---

## ✅ Current Status

| Feature | Status |
|---|---|
| Landing Page (Homepage) | ✅ Complete |
| Navbar + Mobile Menu | ✅ Complete |
| Hero Section | ✅ Complete |
| Categories Section | ✅ Complete |
| Popular Restaurants Section | ✅ Complete |
| Request Anything Section | ✅ Complete |
| Footer | ✅ Complete |
| Login Page (UI) | ✅ Complete |
| Sign Up Page (UI) | ✅ Complete |
| 404 Page | ✅ Complete |
| Auth (Supabase) | 🔜 Next |
| Dashboard | 🔜 Next |
| Cart & Checkout | 🔜 Next |
| Vendor Panel | 🔜 Next |
| Admin Panel | 🔜 Next |

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Backend/Auth**: Supabase
- **Fonts**: Syne (display) + DM Sans (body)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these from: [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → API**

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
swiftdrop/
├── src/
│   ├── app/
│   │   ├── (auth)/               # Auth pages (no navbar)
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (main)/               # Main pages (with navbar + footer)
│   │   │   ├── layout.tsx
│   │   │   ├── restaurants/page.tsx
│   │   │   ├── grocery/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── layout.tsx            # Root layout (fonts, metadata)
│   │   ├── page.tsx              # Homepage
│   │   └── not-found.tsx         # 404 page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/             # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── RestaurantsSection.tsx
│   │   │   └── RequestAnythingSection.tsx
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/
│   │   ├── useInView.ts          # Scroll animation hook
│   │   └── useToast.ts           # Toast notifications
│   ├── lib/
│   │   ├── constants.ts          # App-wide data & constants
│   │   ├── utils.ts              # cn(), formatCurrency(), etc.
│   │   └── supabase/
│   │       ├── client.ts         # Browser Supabase client
│   │       └── server.ts         # Server Supabase client
│   ├── middleware.ts              # Auth session refresh + route protection
│   ├── styles/globals.css
│   └── types/index.ts
├── public/
├── .env.local                    # ← Fill in your Supabase keys
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Orange | `#FF6B00` |
| Dark Background | `#0D0F14` |
| Card Background | `#1A2035` |
| Accent Green | `#16A34A` |
| Text Muted | `#9CA3AF` |
| Border | `rgba(255,255,255,0.08)` |

**CSS utility classes available:**
- `.glass-card` — glassmorphism card
- `.btn-orange` — primary orange CTA button
- `.btn-ghost` — ghost/outline button
- `.section-label` — small orange pill label

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🤝 Contributing

This project is being built incrementally. Next phases:
1. Supabase Auth (email + Google OAuth)
2. Customer Dashboard
3. Cart & Checkout flow
4. Real-time order tracking
5. Vendor panel
6. Admin panel
