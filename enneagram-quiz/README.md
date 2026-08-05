# Enneagram Work Styles Quiz — Donut Studios

A 10-question Enneagram quiz for the internal team, built from the ["Enneagram Work Styles Quiz"](https://app.notion.com/p/donutdigital/Enneagram-Work-Styles-Quiz-3b2754fa153f808bb602ca274fb195a7) Notion doc. Each teammate takes the quiz, sees their dominant Enneagram type immediately, and their result is saved to a password-protected results page that only the dev/CS team can see.

**What's inside:**
- `public/index.html` — the quiz itself (name entry → 10 questions → results with a donut-wheel score chart)
- `public/admin.html` — password-gated results dashboard (table + CSV export + delete)
- `netlify/functions/` — three small serverless functions that save/read/delete results using **Netlify Blobs** (Netlify's built-in data store — no external database needed)
- `public/style.css` — shared styling

---

## 1. Deploy it to Netlify

I can't push this to Netlify directly (no Netlify connection is set up in this workspace), so here's the fastest path — takes about 2 minutes:

**Easiest — drag and drop:**
1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag the whole `enneagram-quiz` folder onto the page
3. Netlify gives you a live URL immediately (something like `random-name-123.netlify.app`)

**Better for ongoing edits — connect to GitHub:**
1. Create a new repo (e.g. in the Donut GitHub org) and push this folder to it
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick the repo
3. Build settings are already set via `netlify.toml` (publish = `public`, functions = `netlify/functions`) — you shouldn't need to change anything
4. Deploy

Either way, once live you can rename the site (**Site configuration → Change site name**) or attach a custom domain like `enneagram.donutstudios.com`.

---

## 2. Set the admin password (required)

The `/admin.html` results page is protected by a password stored as an environment variable — it's never hard-coded in the app.

1. In the Netlify dashboard: **Site configuration → Environment variables → Add a variable**
2. Key: `ADMIN_PASSWORD`
3. Value: whatever you want the team's shared password to be
4. Save, then **trigger a redeploy** (Deploys tab → Trigger deploy) so the functions pick it up

Until this is set, `/admin.html` will show a clear message telling whoever's looking that the password hasn't been configured yet.

> Heads up: this is a simple shared-password gate, appropriate for an internal team tool — not full user authentication. Treat the admin URL and password like you would a shared internal doc link.

## 3. That's it — Netlify Blobs needs no setup

Every submission is saved automatically via Netlify Blobs, which is enabled by default on all Netlify sites. There's nothing to provision — no database, no API keys.

---

## Using it

- **Team members:** go to the site's root URL, enter their name, and answer all 10 questions
- **Results:** each person immediately sees their own dominant type, a full breakdown across all 9 types, and a donut-wheel chart
- **You (or whoever holds the password):** go to `/admin.html` on the same site to see everyone's name, dominant type, submission time, full percentage breakdown, export everything to CSV, or delete a stray/test submission

## Customizing

- **Questions/answers/type descriptions** live in the `QUESTIONS` and `TYPES` objects near the top of the `<script>` in `public/index.html` — edit the text directly there if the source doc changes.
- **Colors** are CSS variables at the top of `public/style.css` (`--glaze-pink`, `--t1` through `--t9`, etc.) — the 9 type colors are grouped by Enneagram triad (Gut/Heart/Head) rather than random, so recoloring one shifts its whole triad family if you want to keep that logic.
- Answer order is shuffled per person per question (the underlying scoring is unaffected) so nobody can pattern-match "top answer = Type 1."

## A note on the design

I couldn't find Donut's exact internal brand colors/logo file, so I pulled the palette from Donut Studios' public site (the pink/orange "glaze" tones) and built a simple donut mark from scratch rather than guess at the real logo. Swap in the actual logo file and any exact brand hex codes in `style.css` / the SVG marks in the two HTML files if you'd like it pixel-matched to brand guidelines.
