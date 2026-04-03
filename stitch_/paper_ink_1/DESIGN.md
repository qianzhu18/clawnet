# Design System Specification: The Architectural Document

## 1. Overview & Creative North Star
**Creative North Star: The Living Manuscript**

This design system moves beyond simple minimalism to embrace the aesthetic of a high-end, bespoke digital manuscript. It treats the interface not as a software application, but as a structured, intentional workspace where the content is the only priority.

To break the "standard template" look, we employ **Intentional Asymmetry** and **Massive Negative Space**. By utilizing wide margins (up to `24` on our spacing scale) and shifting content slightly off-center, we create a sense of editorial authority. The goal is a "Quiet Luxury" experience: expensive-feeling because of what is *not* there, rather than what is.

---

## 2. Colors & Surface Logic
The palette is rooted in a high-contrast monochrome foundation, but depth is achieved through "Tonal Nesting" rather than lines.

### Surface Hierarchy & The "No-Line" Rule
Traditional UI relies on borders to separate sections. This system prohibits that. Boundaries must be defined through background shifts.
- **Base Layer:** Use `surface` (#faf9f7) for the main canvas.
- **Nesting Layers:** Place a `surface_container_low` (#f4f4f2) section to define a sidebar or header. Use `surface_container_lowest` (#ffffff) for the active "paper" or "document" area to create a natural, soft lift.
- **The Glass Fallback:** For floating menus or popovers, use `surface` with a 80% opacity and a `20px` backdrop-blur. This ensures the "manuscript" beneath remains visible but legible.

### Signature Texture
While the base is flat, primary CTAs should utilize a microscopic tonal shift. A button using `primary` (#000000) should have a 1% linear gradient to `primary_container` (#3d3b35) to prevent it from looking like a digital "hole" on the page, giving it the density of physical ink.

---

## 3. Typography
Typography is our primary tool for architectural structure. We use **Inter** for its neutral, objective clarity.

- **Display & Headlines:** Use `display-lg` and `headline-lg` to create clear "entry points" into the document. These should be set with tight letter-spacing (-0.02em) to feel cohesive and authoritative.
- **The Body Narrative:** `body-lg` (1rem) is the workhorse. High line-height (1.6) is mandatory to ensure the "Editorial" feel.
- **Labels:** `label-md` and `label-sm` should be used sparingly for metadata. 
- **The Hierarchy Rule:** Skip sizes to create drama. Pair a `display-md` title directly with a `body-md` description to emphasize the hierarchy through scale contrast.

---

## 4. Elevation & Depth
We reject the "Drop Shadow." Depth in this system is a result of **Atmospheric Layering**.

- **The Layering Principle:** Stack `surface_container` tiers. A `surface_container_highest` (#e2e2e1) element on a `surface` (#faf9f7) background creates all the "elevation" required for a secondary module.
- **Ambient Shadows:** Only for top-level modals. Use `on_surface` (#1a1c1b) at 4% opacity with a blur of `32px` and a `16px` Y-offset. It should feel like a soft glow, not a shadow.
- **The Ghost Border:** For input fields or cards where containment is legally or functionally required, use `outline_variant` (#c6c6c6) at **15% opacity**. If it's clearly visible at a glance, it's too dark.

---

## 5. Components

### Buttons
- **Primary:** Background: `primary` (#000000); Text: `on_primary` (#e7e2d9); Radius: `md` (0.375rem). Use `3.5` (1.2rem) horizontal padding.
- **Secondary:** Background: `surface_container_high`; Text: `primary`; No border.
- **Tertiary (Ghost):** No background. Text: `secondary`. Underline only on hover.

### Input Fields
- **Styling:** Forbid 100% opaque borders. Use a `surface_container_low` background with a `sm` radius. 
- **States:** On focus, the background shifts to `surface_container_lowest` (#ffffff) with a 1px `primary` bottom-border only.

### Cards & Lists
- **The No-Divider Rule:** Forbid horizontal lines between list items. Use spacing `2` or `3` to separate items. For cards, use a background shift to `surface_container_low` to define the container area.

### Chips
- **Action Chips:** Use `secondary_container` (#d6d4d1) with `on_secondary_fixed_variant` (#3b3b39) text. Shape should be `full` (9999px) for a soft, pill-like contrast against the rigid document grid.

---

## 6. Do’s and Don’ts

### Do:
- **Use "Aggressive" Whitespace:** If you think there is enough margin, add `1.5` more from the spacing scale.
- **Align to a Columnar Grid:** Even if asymmetric, elements must feel "snapped" to an invisible vertical axis.
- **Monochrome Icons:** Use only 1.5px stroke line icons. Fill is strictly forbidden unless indicating a "selected" state.

### Don’t:
- **Don't use pure black text on pure white:** Use `primary` (#000000) for headers and `secondary` (#5f5e5c) for long-form body text to reduce eye strain and increase the "premium" feel.
- **Don't use 1px solid #000 borders:** This breaks the "Living Manuscript" vibe. Use background tonal shifts.
- **Don't use standard easing:** Use `cubic-bezier(0.2, 0, 0, 1)` for all transitions. It feels heavy, intentional, and high-end.