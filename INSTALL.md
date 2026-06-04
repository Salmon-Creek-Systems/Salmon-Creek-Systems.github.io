# Installing the new theme

Your site is a **Jekyll** site (GitHub Pages builds it automatically). These files
add a shared layout + stylesheet while your content stays in plain Markdown.

## What goes in the repo

Copy the contents of this `site/` folder into the **root** of
`Salmon-Creek-Systems.github.io`, so the repo looks like:

```
Salmon-Creek-Systems.github.io/
├─ _config.yml                ← new (or merge into your existing one)
├─ _layouts/
│  └─ default.html            ← new — shared header / nav / footer
├─ assets/
│  └─ css/
│     └─ main.css             ← new — the whole theme
├─ index.md                   ← replaces your current index.md
├─ images/                    ← keep your existing images
├─ Vision Statement.md        ← unchanged
├─ Architectural Overview.md  ← unchanged
└─ Code Documentation …       ← unchanged
```

## How it works

- **`_layouts/default.html`** is the shared page shell: the wordmark, the top nav,
  and the footer with your contact info. Every page that has `layout: default`
  (set automatically by `_config.yml`) is wrapped in it.
- **`assets/css/main.css`** styles the *rendered Markdown* — headings, lists,
  links, images. You almost never need to touch your `.md` files to restyle.
- Your prose lives in **`index.md`** (and the other `.md` pages). Edit those like
  any Markdown file; the look stays consistent.

## To apply it to your other pages

Add this front matter to the top of `Vision Statement.md`, `Architectural
Overview.md`, etc. The `defaults:` block in `_config.yml` already sets the layout
for you, but inner pages look best with a little extra:

```yaml
---
layout: default
title: Vision Statement
eyebrow: Vision & Philosophy      # small label above the title (optional)
summary: >-                        # one-line standfirst under the title (optional)
  The principles and design philosophy behind the Stewardship Atlas.
---
```

- `title` becomes the big page masthead (with a "← Salmon Creek Systems" back link).
- `eyebrow` and `summary` are optional flourishes — leave them out and the page
  still looks right.
- **Don't repeat the title as a `#` heading** in the body — the masthead already
  shows it. Start the body with your first section heading or paragraph.

### The "Code Documentation" page

That page is an `index.html` app (mostly JavaScript), not Markdown, so it won't go
through this layout automatically. If you'd like it to share the same header/footer
chrome, tell me and I'll wire it up; otherwise it's fine left as-is.

## Editing the nav or contact info

- **Nav links:** edit the `<nav class="site-nav">` block in `_layouts/default.html`.
- **Contact / footer:** edit the `<footer>` block in the same file.
- **Colors / fonts:** the tokens at the top of `assets/css/main.css` (`:root { … }`)
  control the whole palette and type. Change them in one place.

## Notes on content changes I made to index.md

I lightly cleaned the copy — no meaning changed. Review before publishing:

- Hero now leads with **“You cannot manage what you cannot measure”** (company name
  lives in the header wordmark, so it isn't repeated).
- Fixed typos: *terminteroperability → long-term interoperability*, *thorugh → through*,
  *implementions → implementations*, *low-frction → low-friction*, *philosopy → philosophy*,
  *atals_architecture / OVerview → Architectural Overview*.
- The stray `** Stewardship Atlas Platform` became a proper `### Stewardship Atlas Platform` heading.
- Image `alt` text made descriptive (was just “image”).
