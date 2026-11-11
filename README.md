# Leana Hub Guest House — website

A one-page site for Leana Hub Guest House, 116 Rivier Street, Potchefstroom.
Plain HTML, CSS and JavaScript. GSAP drives the scroll scenes; Three.js draws the six brass room keys floating in the hero (click one to open its room).

## Run it

```bash
npm install
npm run serve        # http://localhost:4173
```

`index.html` also opens straight from the file system.

## Deploy

Upload `index.html` and the `assets/` folder to any static host (Netlify, Vercel, cPanel, GitHub Pages).
Nothing else is needed at runtime. `source-photos/`, `references/`, `src/`, `tools/` and `node_modules/` stay behind.

Live on GitHub Pages: https://ystervarkies.github.io/leana-hub-guesthouse/ (pushing to `main` redeploys). If the site moves to its own domain, update `og:image` and `og:url` in `index.html`.

## Change things

| What | Where |
| --- | --- |
| Room names, beds, sleeps, colours, photos | `ROOMS` at the top of `assets/js/main.js`, and the room cards in `index.html` |
| Text on the page | `index.html` |
| Colours, type sizes, spacing | the tokens at the top of `assets/css/styles.css` |
| The room keys (3D) | `src/keys.js` (names, colours, positions), then `npm run build` to rebuild `assets/js/keys.js` |
| Photos | `assets/img/` (WebP, two sizes each); full-size originals in `source-photos/` |

## Confirm with Leana before launch

- **Which photo belongs to which room.** The Booking.com gallery does not say; the mapping is a best reading of the decor.
- **The room nicknames** (Slate, Navy, Protea, Pine, Olive, Linen) were coined for the site from each room's decor.
- **Photo rights.** All photos come from the property's Booking.com listing; confirm Leana Hub owns them.
- **No prices are shown.** "See rates on Booking.com" opens the listing with the visitor's dates and party filled in.
- **No email address** was found, so contact is phone and WhatsApp (079 296 2187).

## Sources

Facts on the page come from the Booking.com listing, the Google Business profile and the Facebook page
(address, rooms, beds, facilities, hours, house rules, phone, ratings as of November 2026).
