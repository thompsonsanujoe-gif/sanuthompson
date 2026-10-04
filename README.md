# Sanu Thompson — Portfolio Website

A static site (plain HTML/CSS/JS, no build step, no server needed). Everything in
this folder is ready to upload as-is.

## What's in here

```
index.html        the whole site shell (routing + markup)
app.js             page logic (hero slider, filters, lightbox, routing)
data.js            all content: categories, captions, hero slides, film list
assets/            all images, organized by section
_headers           Cloudflare caching rules (safe to leave as is)
.gitignore         keeps junk files out of the repo
```

The site uses hash-based routing (`#/work`, `#/films`, etc.) — every "page" is
handled by JavaScript in the browser, nothing round-trips to the server. That
means there's no special server configuration needed for routing to work on
Cloudflare; a plain static-site deploy is enough.

---

## Step 1 — Create the GitHub repository

1. Log in to the new GitHub account.
2. Click the **+** icon (top right) → **New repository**.
3. Name it something like `sanu-thompson-portfolio`.
4. Leave it **Public** (or Private — both work fine with Cloudflare Pages).
5. Do **not** tick "Add a README" — you're uploading one.
6. Click **Create repository**.

## Step 2 — Upload the files

1. On the new (empty) repo page, click **uploading an existing file**.
2. Unzip this folder on your computer first — GitHub's uploader doesn't
   accept a `.zip`, it needs the actual files and folders.
3. Drag the **contents** of the unzipped folder in — `index.html`, `app.js`,
   `data.js`, `assets/`, `_headers`, `.gitignore`, `README.md` — not the
   outer folder itself. (You can drag the whole selection in one go; GitHub
   preserves the `assets/` folder structure.)
4. Scroll down, add a commit message like "Initial site upload," and click
   **Commit changes**.
5. Give it a minute — there are ~120 files (mostly images), so the upload
   may take a short while depending on your connection.

## Step 3 — Deploy on Cloudflare Pages

1. Log in to the new Cloudflare account.
2. In the left sidebar, go to **Workers & Pages**.
3. Click **Create** → **Pages** → **Connect to Git**.
4. Authorize Cloudflare to access the GitHub account if prompted, then
   select the `sanu-thompson-portfolio` repository.
5. On the build settings screen:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/` (the repo root — since `index.html` sits
     at the top level, not inside a subfolder)
6. Click **Save and Deploy**.
7. Cloudflare will give you a live URL in a minute or two, something like
   `sanu-thompson-portfolio.pages.dev`.

## Step 4 (optional) — Connect a custom domain

Once it's live on the `.pages.dev` URL, you can attach a real domain:

1. In the Pages project, go to **Custom domains** → **Set up a domain**.
2. Enter the domain (e.g. `sanuthompson.com`) and follow the DNS
   instructions shown. If the domain is already on Cloudflare, this is
   usually a one-click confirmation; if it's registered elsewhere, you'll
   add a CNAME record at the registrar.

---

## Making changes later

Any time you edit a file and push the change to the `main` branch on
GitHub (including a plain drag-and-drop re-upload through the GitHub web
UI), Cloudflare Pages automatically rebuilds and redeploys — no extra step
needed on the Cloudflare side.

## Known placeholders to swap in later

- **Contact page** — email, phone, and Instagram handle in `data.js` /
  `app.js` are placeholders.
- **Films page** — the three film cards currently show static thumbnail
  images with a play icon. Once the films are hosted on YouTube or Vimeo,
  the click handler in `app.js` (`renderFilms` function) can be pointed at
  a real embed instead of the lightbox placeholder.
