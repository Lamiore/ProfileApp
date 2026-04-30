# Home Page Export

Snapshot semua kode yang menyusun **home page** (`/`) — components, styles, animasi GSAP, dependencies — dikumpulkan di satu folder agar mudah dicopy ke project lain.

## Struktur folder

```
home-export/
├── page.tsx                     # composition root (Hero + Origin + Moodboard + Marquee + Skills + Contact)
├── styles/
│   ├── home.css                 # semua style kelas .home-root, .hero-*, .og-*, .moodboard-*, .skills-*, .contact-*, dll
│   └── map-pulse.css            # animasi pulsing untuk map marker (Contact section)
├── components/
│   ├── Hero.tsx                 # judul ILHAM MOHAMMAD + portrait + GSAP entrance + scroll & mouse parallax
│   ├── Origin.tsx               # photocard deck + horizontal pin scroll story (GSAP ScrollTrigger)
│   ├── Moodboard.tsx            # masonry foto with tape overlays
│   ├── Marquee.tsx              # infinite horizontal text strip (CSS animation .marquee-track)
│   ├── Skills.tsx               # works grid + skill items
│   ├── Contact.tsx              # discord status (Lanyard) + map + form
│   ├── Primitives.tsx           # Polaroid, Tape components (reused by Origin & Moodboard)
│   └── ui/
│       └── sparkles-text.tsx    # SparklesOverlay efek partikel di Hero title
├── lib/
│   ├── useLanyard.ts            # hook real-time Discord presence via Lanyard WebSocket
│   ├── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   └── firebase.ts              # Firebase init (Firestore + Auth) — Skills membaca koleksi `works`
└── features/
    └── works/
        ├── hooks/
        │   └── use-works.ts     # subscribe Firestore koleksi "works" untuk Skills section
        └── types.ts             # WorkItem type
```

## NPM dependencies wajib

```bash
npm install next react react-dom \
  gsap \
  framer-motion \
  firebase \
  lucide-react \
  clsx tailwind-merge
```

> Hero juga memakai `next/image` (built-in Next.js).

## CSS variables yang diharapkan

`home.css` mengasumsikan beberapa variable global di `:root` atau scope `.home-root`:

```css
:root {
  --paper: #0d0d0d;       /* background utama */
  --paper-2: #1f1f1f;     /* paper sekunder */
  --ink: #f2ede4;         /* warna teks utama */
  --ink-2: #d4cec0;       /* teks sekunder */
  --muted: #6b6b66;       /* meta/subtle */
  --accent: #d7263d;      /* merah utama */

  /* font variables (next/font) */
  --font-climate-crisis: 'Climate Crisis', sans-serif;
  --font-caveat: 'Caveat', cursive;
  --font-instrument-serif: 'Instrument Serif', serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace;
  --font-space-grotesk: 'Space Grotesk', sans-serif;
}
```

Setup font pakai `next/font/google` di `app/layout.tsx`:

```tsx
import { Climate_Crisis, Caveat, Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
const climateCrisis = Climate_Crisis({ variable: "--font-climate-crisis", subsets: ["latin"], weight: "400" });
// ...wire ke <body className={`${climateCrisis.variable} ...`}>
```

## Aset yang dibutuhkan di `/public/image/home/`

- `Gueh.png` — portrait Hero (1427×1340 atau aspect ratio mirip)
- `origin/1.jpg`, `origin/2.jpg`, `origin/3.png` — photocards Origin section
- `moodboard/*.jpg` — koleksi foto Moodboard (cek `Moodboard.tsx` untuk daftar nama)
- `skills/*.svg` atau image — icon/asset skills

## Environment variables (Firebase)

Buat `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Discord ID untuk Lanyard

Edit `Contact.tsx` cari `DISCORD_USER_ID` dan ganti dengan Discord user ID-nya. Pastikan user join Discord [Lanyard server](https://discord.com/invite/UrXF2cfJ7F) dulu agar presence terbaca.

## GSAP plugins

- `gsap` (core) — pakai di Hero, Origin, Moodboard, Skills, Contact
- `gsap/ScrollTrigger` — register di Hero, Origin, Skills (auto via `gsap.registerPlugin(ScrollTrigger)` di tiap file)

## Cara wiring di project baru

1. Copy seluruh isi `home-export/` ke project Next.js baru, sesuaikan path:
   - `page.tsx` → `app/page.tsx`
   - `components/*` → `components/home/*`
   - `components/ui/*` → `components/ui/*`
   - `styles/*` → `app/styles/*` (atau global lokasi CSS-mu)
   - `lib/*` → `lib/*`
   - `features/*` → `features/*`
2. Update import alias di tiap file kalau struktur berbeda — semua file pakai `@/...` (alias root).
3. Import CSS-nya di `app/layout.tsx` atau `app/globals.css`:
   ```css
   @import "./styles/home.css";
   @import "./styles/map-pulse.css";
   ```
4. Pastikan `tsconfig.json` punya path alias:
   ```json
   { "compilerOptions": { "paths": { "@/*": ["./*"] } } }
   ```

## Catatan animasi

- **Hero**: GSAP timeline orchestrated entrance + ScrollTrigger parallax `yPercent: 35` untuk teks belakang + mouse-move parallax `quickTo` untuk portrait & teks.
- **Origin**: pin section + horizontal scroll dengan ScrollTrigger; photocard deck reorder on click.
- **Moodboard**: GSAP `from` scroll-triggered untuk fade-in + hover scale.
- **Marquee**: pure CSS `@keyframes marquee-scroll` di `home.css`.
- **Skills**: ScrollTrigger reveal + grid layout.
- **Contact**: Lanyard websocket realtime status + map dengan pulsing CSS dari `map-pulse.css`.

## Snapshot date

Snapshot dibuat: 2026-04-27
