# Hero Typography Redesign

## Goal

Redesign the typography and layout system of the hero section to create a clean, professional, premium typographic hierarchy. Keep all images, grid background, window system, and animations unchanged.

## Design Decisions

- **Font**: Satoshi (free via Fontshare/Google Fonts) — single font family, no serif mix
- **Philosophy**: Pure minimal. Hierarchy via size, weight, and opacity only.
- **Layout**: Two-block split (left bottom + right top), open center for hero grid to breathe
- **Labels**: Uppercase small label above intro block for editorial feel

## Font Loading

Replace Helvetica 1957 references with Satoshi. Satoshi is available on Fontshare (not Google Fonts), so load via `@fontsource-variable/satoshi` npm package or download woff2 files to `public/fonts/` and use `next/font/local`. Weights needed: 400, 500, 600, 700.

Update `layout.tsx`:
- Add Satoshi font import via `next/font/local` with CSS variable `--font-satoshi`
- Keep Geist for UI/system text (windows content, etc.)

## Typography Scale

All sizes use fluid `clamp()` for smooth scaling. Based on 8px spacing grid.

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Label | 11–12px | 500 | 100% | +0.12em |
| Hero H1 (left) | clamp(2.5rem, 7vw, 6rem) | 700 | 95% | -0.03em |
| Intro Headline (right) | clamp(2rem, 5vw, 4rem) | 700 | 95% | -0.03em |
| Intro Subtitle (right) | clamp(1rem, 2vw, 1.5rem) | 400 | 140% | -0.01em |
| Nav Buttons | 13–14px | 600 | 100% | +0.08em |

## Hero Section Structure

### Left Block (bottom-left)
Unchanged structure, updated font:
```
Simplicity is the
ultimate sophistication.
```
- Uses Hero H1 scale
- Slide-up reveal animation stays
- Hover inline-image on "ultimate" stays
- Color: #E0E0E0

### Right Block (top-right)
New hierarchy with label:
```
INTRODUCTION              ← label (new)
Hi, I'm Lam.             ← intro headline
I Design, Build,          ← intro subtitle
and Explore.
```
- Label: uppercase, muted color (~40% opacity), spaced-out tracking
- Headline: bold, same style as hero but smaller scale
- Subtitle: regular weight, reduced opacity (~60%), comfortable line-height
- Text-align: right
- Slide-up reveal animation stays

### Center
Empty — no text, no overlays. Grid images are the focal point.

## CSS Changes

### globals.css

1. **`.hero-text`**: Change `font-family` to Satoshi variable. Update `font-weight` to 700. Update `font-size` to `clamp(2.5rem, 7vw, 6rem)`. Set `line-height: 0.95`.

2. **`.hero-intro`**: Keep `max-width: min(44rem, 42vw)`, `text-align: right`. No font-size override — intro headline inherits from a new class.

3. **New `.hero-label`**: `font-size: clamp(0.65rem, 0.8vw, 0.75rem)`, `font-weight: 500`, `text-transform: uppercase`, `letter-spacing: 0.12em`, `color: rgba(224, 224, 224, 0.4)`, `margin-bottom: 16px`.

4. **`.hero-intro-eyebrow`** (rename concept to headline): `font-size: clamp(2rem, 5vw, 4rem)`, `font-weight: 700`, `line-height: 0.95`, `letter-spacing: -0.03em`.

5. **`.hero-intro-body`**: `font-size: clamp(1rem, 2vw, 1.5rem)`, `font-weight: 400`, `line-height: 1.4`, `letter-spacing: -0.01em`, `opacity: 0.6`, `margin-top: 8px`.

6. **Nav buttons**: Update `font-family` to Satoshi. `font-weight: 600`, `letter-spacing: 0.08em`, `font-size: 13px`.

7. **Mobile overrides**: Adjust clamp values for mobile. Label stays same size. Intro headline: `clamp(1.8rem, 8vw, 3rem)`. Subtitle follows proportionally.

8. **Logo**: Update `.flip-text` font-family to Satoshi.

## Component Changes

### Hero.tsx

1. Add label element above eyebrow in intro block (desktop + mobile):
   ```jsx
   <motion.span className="hero-label" ...>INTRODUCTION</motion.span>
   ```

2. Add proper CSS classes to intro spans:
   - Eyebrow span: add `hero-intro-eyebrow` class
   - Body span: keep `hero-intro-body` class

3. Remove `hero-text` class from `.hero-intro` container (intro has its own scale now, not hero H1 scale).

### layout.tsx

1. Import Satoshi font
2. Add CSS variable `--font-satoshi`
3. Apply to body className

## What Does NOT Change

- All images and visual assets
- Grid background system
- Window system (open/close/drag/resize)
- Blur overlay behavior
- Slide-up reveal animations (timing/easing unchanged)
- Hover inline-image on "ultimate"
- Logo flip animation
- Mobile hamburger menu behavior
- Color palette (#E0E0E0, dark background)
