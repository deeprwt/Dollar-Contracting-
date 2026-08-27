# Google Reviews — Trustindex Setup

The `/testimonials` page is wired to auto-display your latest Google reviews via
[Trustindex](https://trustindex.io). Trustindex is free (with a small "Trustindex" badge),
syncs from Google daily, and has no view limits.

Total setup time: ~5 minutes.

## 1. Create a Trustindex account

1. Go to https://www.trustindex.io and click **Sign up** (free).
2. Use the same business email you'd want associated with the reviews.

## 2. Connect your Google Business Profile

1. After signing in, click **Create a new widget**.
2. Choose **Google** as the platform.
3. Search for your business — try `"Dollar Contracting Thunder Bay"`.
   - If it doesn't appear, paste the Google Maps URL: `https://maps.app.goo.gl/7DE4kZ3pMbREc7h1A`
4. Confirm it's the right listing.

## 3. Style the widget (optional)

1. Pick a layout (recommended: **Slider** or **Grid**, 3 columns).
2. Match brand colors:
   - Star color: `#b91c1c` (the site's brand red)
   - Accent: `#b91c1c`
3. Filter: **Show only 4★ and 5★ reviews** if you want.
4. Click **Save & continue**.

## 4. Copy the widget ID

1. Trustindex will give you an embed code that looks like:
   ```html
   <script defer src="https://cdn.trustindex.io/loader.js?XXXXXXXXXXXXXXXXXXXX"></script>
   ```
2. Copy the part **after** `?` — that's the widget ID (a long string of letters/numbers).

## 5. Paste it into `.env`

Open `.env` in this repo and fill in:

```
NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID=YOUR_WIDGET_ID_HERE
```

Restart `npm run dev`. Visit `/testimonials` — the live Google reviews block should appear at the top.

## 6. Deploy to Vercel

When deploying, add the same env var in:
**Vercel → Project Settings → Environment Variables**

```
NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID = your_widget_id
```

(Apply to Production, Preview, and Development.)

## Updating reviews

You don't need to do anything. Trustindex polls Google **once per day** and the widget refreshes
automatically. New Google reviews appear on your site within 24 hours.

## Troubleshooting

- **Widget shows nothing**: double-check the widget ID is correct and the widget is set to
  "Published" in the Trustindex dashboard.
- **Old reviews missing**: Google's API only exposes the most recent reviews. Trustindex
  caches what it sees over time, so the widget gets more complete the longer it runs.
- **Want to remove the Trustindex badge**: requires their paid plan (~$5/mo).

## Want a different widget service later?

The code is isolated to:
- `src/components/sections/google-reviews-embed.tsx` — swap the script URL
- `src/components/sections/google-reviews-section.tsx` — section wrapper
- `NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID` env var

So swapping to Elfsight, EmbedSocial, etc. later is a 10-minute change.
