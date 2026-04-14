# Design: Windows → Pages

**Date:** 2026-04-14  
**Status:** Approved

## Summary

Replace floating windows (About, Blog, Gallery, Connect) with full pages. Nav stays visible and consistent across all pages with an animated underline on the active route. Home page stays exactly as-is.

---

## Architecture

### Route Structure

```
app/
  page.tsx                        # Home — unchanged
  layout.tsx                      # Root layout — unchanged
  (pages)/
    layout.tsx                    # NEW: shared layout with Nav + plain #111 bg
    about/
      page.tsx                    # NEW
    blog/
      page.tsx                    # NEW (listing)
      [id]/
        page.tsx                  # MOVED from app/blog/[id]/page.tsx
    gallery/
      page.tsx                    # NEW
    connect/
      page.tsx                    # NEW
```

### Components

| File | Action | Notes |
|------|--------|-------|
| `components/Nav.tsx` | **NEW** | Extracted from Hero.tsx |
| `components/Hero.tsx` | **MODIFIED** | Remove all window state, use `<Nav />` |
| `components/BlurOverlay.tsx` | **DELETED** | No longer used |
| `components/window.tsx` | **KEEP** | Still used by GalleryWindow preview |

---

## Nav Component (`components/Nav.tsx`)

- Uses `usePathname()` to detect active route
- Uses `usePageTransition()` for navigation (consistent curtain transition)
- Active route → animated underline (`scaleX` 0→1, `transform-origin: left`, CSS transition)
- Home page (`/`): no active underline on any item
- Char flip animation: identical to current Hero nav
- Font, spacing, padding: identical to current Hero nav
- No props needed

**Routes:**
- About → `/about`
- Blog → `/blog`
- Gallery → `/gallery`
- Connect → `/connect`

---

## Sub-pages Layout (`app/(pages)/layout.tsx`)

- Background: `#111`
- Nav rendered at top (same position/style as Hero nav)
- Content area: `padding-top` sufficient so nav doesn't overlap content
- Normal scroll (no `overflow: hidden`)
- Page transition curtain applies on all routes

---

## Page Content

Each page wraps the existing window component — no content rewritten:

| Route | Component |
|-------|-----------|
| `/about` | `<AboutWindow />` |
| `/blog` | `<BlogWindow />` |
| `/gallery` | `<GalleryWindow />` (floating preview window unchanged) |
| `/connect` | `<ConnectionWindow />` |

Content is centered with `max-width` and comfortable padding.

---

## Hero.tsx Cleanup

**Remove:**
- State: `openWindows`, `windowZMap`, `peeking`, `windowSize`
- Refs: `focusCounter`, `windowsOpenRef`
- Functions: `toggleWindow`, `bringToFront`, `closeWindow`, `gridLayout` IIFE
- Imports: `Window`, `BlurOverlay`, `AnimatePresence`, all window components
- JSX: all `AnimatePresence` blocks (desktop windows + mobile fullscreen view)
- Frame throttle (`windowsOpenRef` check in animate loop) → grid runs full 60fps

**Keep:**
- Infinite scrolling grid (all RAF, drag, touch, idle drift logic)
- LAM badge (bottom-left)
- `<Nav />` (same position, top of hero)

---

## What Does NOT Change

- `app/page.tsx` — untouched
- `app/layout.tsx` — untouched
- `app/card/page.tsx` — untouched
- `components/window.tsx` — untouched
- `components/windows/gallerywindow.tsx` — untouched
- `components/windows/aboutwindow.tsx`, `blogwindow.tsx`, `connectionwindow.tsx`, `adminwindow.tsx` — untouched
- Page transition curtain animation — same behavior
