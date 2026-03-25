```markdown
# Design System Specification: Editorial Minimalism

## 1. Overview & Creative North Star: "The Digital Archivist"
This design system rejects the cluttered "app" aesthetic in favor of a high-end editorial experience. Our Creative North Star is **The Digital Archivist**: a philosophy where the interface recedes to let the content breathe with the authority of a premium broadsheet or a gallery catalog.

We break the traditional "Notion-clone" template by employing **Intentional Asymmetry**. Instead of a centered, rigid grid, we utilize generous, uneven whitespace (e.g., a massive `24` unit left margin against a tight `8` unit right margin) to create a sense of movement. We move beyond "flat" by focusing on **Tonal Depth**—using the subtle shifts in our monochrome palette to imply hierarchy without the crutch of shadows or heavy lines.

---

## 2. Colors
Our palette is a study in restrained charcoal and bone. We do not use color to signal importance; we use contrast and density.

| Role | Token | Value | Intent |
| :--- | :--- | :--- | :--- |
| **Background** | `surface` | `#FFFFFF` | The primary canvas. Pure and expansive. |
| **Primary Text** | `on_surface` | `#37352F` | Soft charcoal for high legibility without harshness. |
| **Secondary Text** | `on_surface_variant`| `#9B9A97` | For metadata and de-emphasized labels. |
| **Accent/Primary** | `primary` | `#000000` | Absolute black for definitive action points. |
| **Subtle Stroke** | `outline_variant` | `#E9E9E7` | For the "Ghost Border" only. |
| **Container Low** | `surface_container_low` | `#F9F9F9` | For subtle sectioning. |

### The "No-Line" Rule
Sectioning must be achieved through **Whitespace (Scale 8-16)** or **Background Shifts**. Prohibit 1px solid borders for broad layout sectioning. A sidebar should be defined by its transition from `surface` to `surface_container_low`, not a vertical line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of fine vellum. 
*   **Level 0:** `surface` (#FFFFFF) - The base.
*   **Level 1:** `surface_container_low` (#F9F9F9) - Sub-navigation or secondary panels.
*   **Level 2:** `surface_container` (#EEEEEE) - Hover states or active inset regions.

---

## 3. Typography
We use **Inter** as our functional backbone, relying on extreme scale shifts to communicate hierarchy. 

*   **Display (Large/Med):** `3.5rem` / `2.75rem`. Use these for "Moment" screens. Set with `tracking-tighter` (-0.02em) and `font-weight: 600`.
*   **Headlines:** `headline-sm` (`1.5rem`) is our workhorse. It should feel authoritative, surrounded by at least `spacing-12` of vertical clearance.
*   **Body:** `body-md` (`0.875rem`). This is the standard for long-form reading. Line height must be generous (1.6) to maintain the editorial feel.
*   **Labels:** `label-sm` (`0.6875rem`). Always `uppercase` with `letter-spacing: 0.05em`. This provides a "technical" counterpoint to the organic body text.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are strictly forbidden. Depth is an illusion created by the interaction of surfaces.

*   **The Layering Principle:** To "lift" a card, do not add a shadow. Instead, place a `surface_container_lowest` (#FFFFFF) card on a `surface_container_low` (#F9F9F9) background. The 1% difference in brightness is enough for the human eye to perceive a physical layer.
*   **The "Ghost Border" Fallback:** In high-density data views where background shifts aren't enough, use a `1px` border using `outline_variant` (#E9E9E7) at **50% opacity**. It should be felt, not seen.
*   **Interaction States:** Use "Surface Dimming." When an element is pressed, shift its background from `surface` to `surface_container` (#EEEEEE).

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#000000) with `on_primary` text. Radius: `roundness-md` (0.375rem). No hover elevation; instead, hover should trigger a slight opacity shift to 85%.
*   **Secondary:** Ghost style. `1px` stroke of `outline_variant` with `on_surface` text. 

### Input Fields
*   **Styling:** Completely flat. No background color. Only a bottom border of `outline_variant`.
*   **Focus State:** The bottom border transforms to `primary` (#000000) 1px. No "glow" or blue outlines.

### Cards & Lists
*   **The Divider Ban:** Never use horizontal lines to separate list items. Use `spacing-4` padding and `surface_container_low` backgrounds on hover to indicate individual rows.
*   **Asymmetric Cards:** For "Featured" content, use an offset layout where the image or icon sits outside the traditional margin of the text.

### Navigation (The Sidebar)
*   **Structure:** Use `surface_container_low` as the background. Icons should be monochrome line-work (`20px`). Active states are marked by a bold `font-weight: 600` rather than a background highlight.

---

## 6. Do’s and Don’ts

### Do
*   **Do** embrace extreme whitespace. If a section feels "empty," you are likely on the right track.
*   **Do** use `label-sm` for tiny, all-caps metadata to create a "curated catalog" look.
*   **Do** align text to a strict vertical axis while allowing imagery to break the grid.

### Don't
*   **Don't** use any color outside the monochrome scale unless it is a system-critical error (`error` #ba1a1a).
*   **Don't** use 100% opaque gray borders. They create "visual noise" that kills the premium feel.
*   **Don't** use standard `0.5` opacity for disabled states. Use `surface_container_highest` for the background to make the element feel "recessed" into the page.

---

## 7. Designer's Note: The "Silent" UI
Junior designers often feel the need to fill space. In this system, your most powerful tool is **the void**. By stripping away the "Notion" borders and "Material" shadows, you force the user to focus on the content. The hierarchy is not built with boxes; it is built with the intentional placement of ink on a digital page.```