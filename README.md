# Shubhakshata — website

A one-page product site (HTML, CSS and JavaScript only). There is no build step: open `index.html` in a browser, or upload the whole folder to any static host.

```
index.html        page content & SEO tags
css/style.css     colours, fonts, layout, animations
js/main.js        settings, WhatsApp messages, pack prices
images/           product photos
```

## Settings (top of `js/main.js`)

```js
whatsappNumber: '919049873354',   // country code + number, digits only
phoneDisplay:   '+91 90498 73354',
sachetPrice:    7,                // used to calculate pack prices; not shown on the site
messages: { order: '…', general: '…' }
```

- **`messages.order`** is the first message customers send when they tap an **Order on WhatsApp** button. `{pack}`, `{price}` and `{design}` are filled in from what they picked on the page.
- **`messages.general`** is used by the **Chat on WhatsApp** button in the footer.

If the number changes, also update `"telephone"` in the `application/ld+json` block near the top of `index.html`, and the `tel:` link in the footer.

## Packs and designs

Both are the chip buttons in the product section of `index.html`.
- **Packs:** copy or delete a `<button class="chip" … data-qty="…">` and set `data-qty` to the number of sachets. The price is worked out automatically.
- **Designs:** copy a chip in the Design group and set `data-design` to the name used in the WhatsApp message. `data-photo` is the photo shown when it's picked (`0` = first thumbnail).
- If prices change, also update `lowPrice`, `highPrice` and `offerCount` in the JSON-LD block and the price in the meta description.

## Photos

The gallery photos are the `<button class="thumb">` items. To add or replace one, set its `data-src` and the `src` of its `<img>`. Photos are shown square, so keep the sticker near the centre. Use JPG or WebP, about 1200px wide and under 250 KB.

`og-cover.jpg` (1200 × 630) is the preview shown when the link is shared on WhatsApp.

## Hosting

The site is hosted on GitHub Pages from the `main` branch: https://ritz0408.github.io/shubhakshata/

To publish a change, commit and push to `main`; Pages updates within a minute or two.

If you move to your own domain, update `canonical`, `og:url` and `og:image` in the `<head>` of `index.html` to the new address.
