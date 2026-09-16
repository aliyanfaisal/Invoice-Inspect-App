# UI Theme Memory (from Prompt-website)

This document captures the styling, theme, and UI elements used in the `Prompt-website` project so we can replicate the same look and feel in `invoice-checker`.

## 1. Core Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS with custom CSS variables
- **Theming**: `next-themes` (Class strategy for light/dark mode)
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`

## 2. Color Palette & Variables (globals.css)
The design uses a clean, modern aesthetic with glassmorphism and gradient effects.
Primary color is Indigo, Accent is Purple.

**Light Mode**:
- Background: `#fafafa`
- Foreground: `#09090b`
- Card/Popover: `#ffffff`
- Primary: `#4f46e5` (Indigo 600)
- Accent: `#9333ea` (Purple 600)
- Border/Input: `#e4e4e7`

**Dark Mode**:
- Background: `#000000`
- Foreground: `#ffffff`
- Card/Popover: `#0a0a0a`
- Primary: `#818cf8` (Indigo 400)
- Accent: `#c084fc` (Purple 400)
- Border/Input: `#262626`

## 3. Custom Utility Classes
- `.glass` & `.glass-card`: Glassmorphism effects with backdrop blur, semi-transparent backgrounds, and subtle borders.
- `.text-gradient-primary`: Gradient text from Primary to Accent.
- `.bg-grid-pattern`: A subtle background grid pattern (linear gradients for horizontal/vertical lines).
- Global smooth transitions on background, color, border, and shadow.

## 4. Key UI Components
### Theme Switcher
A fixed floating button in the bottom right corner (using `lucide-react` Sun/Moon icons).
- Position: `fixed bottom-6 right-6 z-50`
- Style: Circular, background blur/solid, hover scale and shadow effects.

### Hero Section & Background Elements
- **Glowing Orbs**: Large absolute divs with blur effects (`blur-[120px]`, `mix-blend-multiply`/`screen`) in Primary and Accent colors behind the content.
- **Floating Decorative Elements**: Icons (Sparkles, Code2, ShieldCheck, Zap) wrapped in `framer-motion` elements that animate `y`, `rotate`, and `scale` continuously.
- **Typography**: Large, bold headings (e.g., `text-6xl md:text-8xl font-extrabold tracking-tight`).
- **Call-to-Action Buttons**: Pill-shaped (`rounded-full`), solid background for primary, glass/border for secondary, with hover animations.

## 5. Implementation Strategy for invoice-checker
1. Install necessary dependencies: `next-themes`, `lucide-react`, `framer-motion` (if not already present).
2. Copy the CSS variables and custom utilities from `Prompt-website` to `src/app/globals.css`.
3. Set up `next-themes` ThemeProvider in `layout.tsx`.
4. Create and integrate a `ThemeSwitcher` component.
5. Apply the glowing background elements, grid pattern, and glassmorphism styling to the main layout and landing page of `invoice-checker`.
