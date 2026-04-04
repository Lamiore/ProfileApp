# Hero Typography Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Helvetica 1957 with Satoshi font, establish clear typographic hierarchy with labels, and refine sizing across the hero section.

**Architecture:** Download Satoshi woff2 files to `public/fonts/`, load via `next/font/local` in `layout.tsx`, update all CSS and inline font-family references in `globals.css` and `Hero.tsx`.

**Tech Stack:** Next.js, next/font/local, CSS, Framer Motion

---

### Task 1: Download and configure Satoshi font

**Files:**
- Create: `public/fonts/Satoshi-Variable.woff2`
- Create: `public/fonts/Satoshi-VariableItalic.woff2`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Download Satoshi variable font files**

Download from Fontshare CDN to `public/fonts/`:

```bash
mkdir -p public/fonts
curl -L "https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap" -o /tmp/satoshi-css.txt
# Extract woff2 URLs from the CSS and download, OR download directly:
curl -L "https://cdn.fontshare.com/wf/RVWQNO5PEDBCOYRSCDIHGWHUTS3COXWP/MBSTUQNX7LU25SPTQDTQO5IUWWYC4NJA/EDMMHVYTIBC2JXFCUMAKWWLKR6QU742X.woff2" -o public/fonts/Satoshi-Variable.woff2
curl -L "https://cdn.fontshare.com/wf/RVWQNO5PEDBCOYRSCDIHGWHUTS3COXWP/RK2WQ6SHXDHBNUZEWHJRUZABP5DVKDIJ/P2HKFHKFN7BXBTQNDH7LLBVIBKOQF5ZO.woff2" -o public/fonts/Satoshi-VariableItalic.woff2
```

If CDN URLs have changed, go to https://www.fontshare.com/fonts/satoshi, download the zip manually, and extract the Variable woff2 files to `public/fonts/`.

- [ ] **Step 2: Configure next/font/local in layout.tsx**

Replace the current content of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lam",
  description: "created by ilham",
};

import PageTransitionProvider from "@/components/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${satoshi.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify font loads**

Run: `npm run dev`
Open browser devtools → Elements → check that `--font-satoshi` CSS variable is set on `<body>`.

- [ ] **Step 4: Commit**

```bash
git add public/fonts/ app/layout.tsx
git commit -m "feat: add Satoshi variable font via next/font/local"
```

---

### Task 2: Update hero typography CSS

**Files:**
- Modify: `app/globals.css:142-175` (logo/flip-text section)
- Modify: `app/globals.css:296-355` (hero typography section)

- [ ] **Step 1: Update `.hero-text` to use Satoshi with new scale**

In `app/globals.css`, replace the `.hero-text` block (lines 297-306):

```css
/* ── Hero Typography ── */
.hero-text {
  font-size: clamp(2.5rem, 7vw, 6rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: #E0E0E0;
  font-family: var(--font-satoshi), 'Helvetica Neue', Helvetica, Arial, sans-serif;
  user-select: none;
  text-shadow: 4px 4px 10px rgba(0, 0, 0, 1);
}
```

Key changes: `font-family` → Satoshi variable, `font-weight` → 700, `font-size` min bumped to 2.5rem, `line-height` → 0.95.

- [ ] **Step 2: Add `.hero-label` class and update `.hero-intro` / `.hero-intro-body`**

Replace the `.hero-intro` and `.hero-intro-body` blocks (lines 308-320) with:

```css
.hero-intro {
  max-width: min(44rem, 42vw);
  padding-right: 0.25rem;
  text-align: right;
}

.hero-label {
  display: block;
  font-family: var(--font-satoshi), 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: clamp(0.65rem, 0.8vw, 0.75rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(224, 224, 224, 0.4);
  margin-bottom: 16px;
}

.hero-intro-eyebrow {
  font-family: var(--font-satoshi), 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: #E0E0E0;
  text-shadow: 4px 4px 10px rgba(0, 0, 0, 1);
}

.hero-intro-body {
  font-family: var(--font-satoshi), 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: rgba(224, 224, 224, 0.6);
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  margin-top: 8px;
}
```

- [ ] **Step 3: Update mobile overrides**

Replace the `@media (max-width: 768px)` hero section (lines 322-352) with:

```css
@media (max-width: 768px) {
  .hero-text {
    font-size: clamp(2.2rem, 10vw, 4rem);
    line-height: 0.95;
  }

  .hero-intro {
    max-width: min(24rem, calc(100vw - 7rem));
    position: absolute;
    top: 6.2rem;
    right: 1.5rem;
    padding-right: 0;
    text-align: right;
    z-index: 65;
  }

  .hero-label {
    font-size: 0.6rem;
    margin-bottom: 12px;
  }

  .hero-intro-eyebrow {
    font-size: clamp(1.8rem, 8vw, 3rem);
  }

  .hero-intro-body {
    font-size: clamp(0.85rem, 3.5vw, 1.2rem);
    max-width: 20ch;
  }

  .hero-hover {
    padding-right: clamp(5rem, 22vw, 8rem);
  }

  .hero-img {
    width: clamp(4.5rem, 20vw, 7rem);
    height: clamp(2.5rem, 9vw, 3.5rem);
  }
}
```

- [ ] **Step 4: Update logo `.flip-text` font-family**

In `app/globals.css`, in the `.flip-text` block (line 174), change:

```css
font-family: var(--font-satoshi), 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: update hero typography to Satoshi with new scale and label class"
```

---

### Task 3: Update Hero.tsx — add label, apply new classes, remove inline font-family

**Files:**
- Modify: `components/Hero.tsx:43-51` (introCopy and motion consts)
- Modify: `components/Hero.tsx:770-795` (nav button inline styles)
- Modify: `components/Hero.tsx:806-820` (nav measure inline styles)
- Modify: `components/Hero.tsx:823-860` (desktop intro block)
- Modify: `components/Hero.tsx:919-949` (mobile intro block)
- Modify: `components/Hero.tsx:1021-1038` (mobile menu button styles)

- [ ] **Step 1: Update introCopy and remove introContainerMotion filter**

Replace lines 43-51 in `components/Hero.tsx`:

```tsx
const introCopy = {
    label: "INTRODUCTION",
    eyebrow: "Hi, I'm Lam.",
    body: "I Design,\u00A0Build, and Explore.",
};

const introContainerMotion = {
    initial: { opacity: 0, y: -14 },
    animate: { opacity: 1, y: 0 },
};
```

Changes: added `label` field, removed `filter` from introContainerMotion (was conflicting with inline blur style).

- [ ] **Step 2: Update desktop intro block (lines ~823-860)**

Replace the desktop intro section with label + proper classes. The `hero-text` class is removed from the container (intro has its own scale now):

```tsx
            {!isMobile && (
                <div
                    className="absolute top-0 left-0 right-0 z-10 flex justify-end p-6 md:p-12"
                    style={{ pointerEvents: "none", paddingTop: "7.5rem" }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hero-intro"
                        style={{
                            filter: openWindows.length > 0 && !peeking ? "blur(6px)" : "none",
                            opacity: openWindows.length > 0 && !peeking ? 0.45 : 1,
                            transition: "filter 0.4s ease, opacity 0.4s ease",
                        }}
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="hero-label"
                        >
                            {introCopy.label}
                        </motion.span>
                        <div className="hero-line">
                            <motion.span
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="hero-intro-eyebrow"
                                style={{ display: "inline-block" }}
                            >
                                {introCopy.eyebrow}
                            </motion.span>
                        </div>
                        <div className="hero-line">
                            <motion.span
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                                className="hero-intro-body"
                                style={{ display: "inline-block" }}
                            >
                                {introCopy.body}
                            </motion.span>
                        </div>
                    </motion.div>
                </div>
            )}
```

- [ ] **Step 3: Update mobile intro block (lines ~919-949)**

Replace the mobile intro section with the same hierarchy:

```tsx
                    {isMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="hero-intro hero-intro-mobile"
                            style={{ pointerEvents: "none" }}
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="hero-label"
                            >
                                {introCopy.label}
                            </motion.span>
                            <div className="hero-line">
                                <motion.span
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
                                    className="hero-intro-eyebrow"
                                    style={{ display: "inline-block" }}
                                >
                                    {introCopy.eyebrow}
                                </motion.span>
                            </div>
                            <div className="hero-line">
                                <motion.span
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
                                    className="hero-intro-body"
                                    style={{ display: "inline-block" }}
                                >
                                    {introCopy.body}
                                </motion.span>
                            </div>
                        </motion.div>
                    )}
```

- [ ] **Step 4: Update nav button font-family references**

In the desktop nav buttons (line ~782), change the inline `fontFamily`:

```tsx
fontFamily: "var(--font-satoshi), 'Helvetica Neue', Helvetica, Arial, sans-serif",
```

Apply the same change in three locations:
1. Desktop nav buttons (line ~782)
2. Nav measure div (line ~812)
3. Mobile menu buttons (line ~1035)

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`
Check:
- Desktop: label "INTRODUCTION" appears above "Hi, I'm Lam." in small uppercase
- "Hi, I'm Lam." is smaller than "Simplicity is the" but same font
- "I Design, Build, and Explore." is subtitle-sized with reduced opacity
- Mobile: same hierarchy, proportional sizing
- All fonts are Satoshi
- Blur on window open still works
- Animations still slide up correctly

- [ ] **Step 6: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add INTRODUCTION label, apply Satoshi font and typographic hierarchy to hero"
```
