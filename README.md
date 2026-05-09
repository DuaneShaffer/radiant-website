# Radiant Church Fairbanks — Website

Static website for [Radiant Church Fairbanks](https://radiantfairbanks.org). Built with HTML, CSS, and Alpine.js. Hosted on GitHub Pages, with Bluehost as the production target.

## Pages

| File | Page |
|------|------|
| `index.html` | Home |
| `about.html` | About Us |
| `doctrines.html` | What We Believe |
| `gather.html` | Sunday Gatherings |
| `sermons.html` | Sermons |
| `events.html` | Events |
| `give.html` | Give |
| `new-here.html` | New Here? |
| `gospel-communities.html` | Gospel Communities |
| `family.html` | Family Ministry |
| `volunteer.html` | Volunteer |
| `prayer.html` | Prayer & Care |
| `partners.html` | Partner Together |
| `faq.html` | FAQ |
| `contact.html` | Contact |

## Tech stack

- **HTML/CSS** — no framework, custom CSS with CSS custom properties
- **[Alpine.js](https://alpinejs.dev)** — mobile nav toggle and dropdown menus
- **[AOS](https://michalsnik.github.io/aos/)** — scroll animations
- **Google Fonts** — Playfair Display + Source Sans 3

## Build system

Nav, footer, and shared head content are defined once in `partials/` and injected into every page at build time. **Edit source files in `src/`, not the root HTML files.**

### Directory structure

```
src/          Source pages — edit these
partials/     Shared HTML fragments
  head.html     Fonts, AOS, Alpine, stylesheet link
  nav.html      Site navigation
  footer.html   Site footer
  scripts.html  AOS + main.js script tags
build.js      Assembles src/ + partials/ → root HTML files
css/          Stylesheets
js/           Scripts
img/          Images
```

### Workflow

1. Edit page content in `src/<page>.html`
2. Edit shared elements in `partials/`
3. Run the build:
   ```
   node build.js
   ```
4. Commit both the `src/` changes and the rebuilt root `.html` files

### Placeholders

Each `src/` file uses four comment placeholders that `build.js` replaces:

| Placeholder | Replaced with |
|-------------|---------------|
| `<!--HEAD-->` | `partials/head.html` |
| `<!--NAV-->` | `partials/nav.html` |
| `<!--FOOTER-->` | `partials/footer.html` |
| `<!--SCRIPTS-->` | `partials/scripts.html` |

Page-specific content — `<title>`, `<meta name="description">`, any page-specific styles — stays in the `src/` file and is not replaced.
