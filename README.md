# Shubhakshata — website

A single-page website (HTML, CSS and JavaScript only). There is no build step: open `index.html` in a browser, or upload the whole folder to any static host (Netlify, GitHub Pages, Hostinger and so on).

```
index.html        page content & SEO tags
css/style.css     colours, fonts, layout, animations
js/main.js        settings, pack prices, order form, WhatsApp links
images/           product photos
```

## Settings

At the top of `js/main.js`:

```js
whatsappNumber: '919049873354',   // country code + number, digits only
phoneDisplay:   '+91 90498 73354',
sachetPrice:    7,                // used to calculate pack prices; not shown on the site
```

Every WhatsApp button and the order form send messages to this number.

If the number changes, also update `"telephone"` in the `application/ld+json` block near the top of `index.html`, and the `tel:` link in the footer.

## Packs

The packs are the `<button class="pack" data-qty="…">` cards in the **Packs & Prices** section of `index.html`.
- **Add or remove a pack:** copy or delete a card and set `data-qty` to the number of sachets.
- Prices (`data-qty × sachetPrice`) and the order form's Pack dropdown update automatically.
- If prices change, also update `lowPrice`, `highPrice` and `offerCount` in the JSON-LD block and the price in the meta description.

## Designs

- **Add a design:** copy a `<figure class="design-card">` block in the **Designs** section, then add a matching `<option>` in the order form's **Design** dropdown, using the same value as the card's `data-design`.
- **Live preview:** `data-theme` on the option sets the preview colours (`ivory`, `red`, `maroon`), and `data-motif` adds the ribbon (`ribbon`) or the palkhi (`palkhi`).

## Images

| File | Where it is used |
|---|---|
| `sachet-amruta-aakash-akshata.webp` | Top banner and the share image |
| `sachet-sayali-raj-flowers.webp` | Wedding Memories section |
| `sachet-sayali-raj.webp` | "Dhanyavad Ribbon" design |
| `sachet-puja-rahul-palkhi.webp` | "Royal Palkhi" design |
| `og-cover.jpg` | Preview shown when the link is shared on WhatsApp (1200 × 630) |

Use JPG or WebP photos about 1200px wide and under 250 KB. Design photos are cropped to a square, so keep the sticker near the centre.

## Hosting

The site is hosted on GitHub Pages from the `main` branch: https://ritz0408.github.io/shubhakshata/

To publish a change, commit and push to `main`; Pages updates within a minute or two.

If you move to your own domain, update `canonical`, `og:url` and `og:image` in the `<head>` of `index.html` to the new address. WhatsApp needs the full image URL to show the preview.
