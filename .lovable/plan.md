

## Plan: Apply Dark Navy / Electric Blue / Cyan Color Palette

Replace the current emerald/navy theme with the user's specified palette across both light and dark modes.

### Color Mapping

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| background | #0A1628 (navy 900) | #F8FAFC (ice) |
| foreground | #E2E8F0 (navy 100) | #0F172A (navy 700) |
| card | #0F172A (navy 700) | #FFFFFF |
| primary | #2563EB (electric 500) | #1E6FD9 (electric 400) |
| secondary | #1E293B (navy 600) | #EFF6FF (ice) |
| muted | #1E293B (navy 600) | #F0F4F8 (ice) |
| muted-foreground | #64748B (navy 300) | #6B7280 (gray 500) |
| accent | #06B6D4 (cyan 500) | #0891B2 (cyan 400) |
| border | #334155 (navy 500) | #E5E7EB (gray 200) |
| ring | #2563EB | #1E6FD9 |
| surface | #020617 (navy 950) | #F4F5F7 (ice) |
| destructive | kept as red | kept as red |
| warning | kept as amber | kept as amber |

### Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Update all CSS custom properties for both `:root` and `.dark` with new HSL values derived from the palette. Update `.gradient-text` to use blue/cyan gradient. Update `.gradient-border` to use electric blue/cyan. Update `.startup-card-hover` glow to electric blue. |
| `tailwind.config.ts` | Add `electric` and `cyan` color tokens if needed for direct utility use. |
| `src/providers/Web3Provider.tsx` | Update RainbowKit `accentColor` from `#534AB7` to `#2563EB`. |
| `src/pages/Landing.tsx` | Update CTA gradient from emerald to electric blue/cyan. Update text colors referencing emerald. |

### Result
The entire app shifts from emerald green to an electric blue + cyan accent scheme on a deep navy base, maintaining the Bloomberg Terminal aesthetic but with a cooler, more distinctive identity.

