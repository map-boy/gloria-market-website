# Shop site with a one-screen admin panel

A small shop website where the owner posts pictures and videos of the shop, and
a visitor sees them on a single public page. Everything on that page is edited
from an admin panel that lives on **one screen** — a sidebar swaps what you are
editing, nothing reloads.

React + TypeScript + Vite + Tailwind, with Firebase for login, data and files.

## What is where

| Route | What it is |
| --- | --- |
| `/` | The public shop page |
| `/admin` | Google sign-in, then the admin panel |

## Nothing is hardcoded

There is no seed content and no placeholder shop. A fresh install shows a blank
page with a "this shop is being set up" note. Every part of the page appears
only once the admin fills it in, and disappears again if they clear it:

- Notice bar, logo, shop name, tagline
- Top banner — label, title, text, picture or video, two buttons
- **Sections** — the admin creates them and names them (Shoes, Bags, In the
  shop, anything). A section starts empty with just its title.
- **Items** inside a section — name, prices, corner label, description, and as
  many pictures and videos as they want
- Highlights strip, about text, contact details, social links, footer note

## Admin panel

One screen, one sidebar. The sidebar is more than a list of words: each entry
has an icon and a line saying what the screen does, sections carry a live count,
a ring at the top shows how much of the page is still blank, and a **Need a
hand?** shortcut plus a **Help** screen answer the questions that come up. It
collapses to an icon rail on desktop and becomes a drawer on mobile.

- **Overview** — counts, a next-step button, and a setup checklist that jumps to
  the right screen
- **Brand & bar**, **Top banner**, **About & contact** — form screens with a
  save bar that appears only when something changed, and an Undo
- **Sections** — create, rename, reorder, hide, set items per row, upload a
  section picture, and manage the items inside without leaving the screen
- **Highlights**, **Team**, **Help**

Pictures and videos are dragged into an upload box with a progress bar. The
first file is the cover; visitors can open any item to page through its media.

## Setup

### 1. Firebase project

In the [Firebase console](https://console.firebase.google.com):

1. Create a project (or use an existing one).
2. **Authentication → Sign-in method → Google → Enable.**
3. **Firestore Database → Create database.**
4. **Storage → Get started.**
5. **Project settings → Your apps → Web app** — copy the config values.

### 2. Local config

```bash
cp .env.example .env
```

Fill in the Firebase values. The two accounts that always have admin access —
the owner (`dprime2002@gmail.com`) and the developer (`techubwenge@gmail.com`)
— are built into `src/lib/config.ts`, so the optional variables can be left
blank. If `.env` is missing entirely, the site shows a setup notice instead of
a blank page.

### 3. Security rules

The rules are what actually grant access — the app's own check is only there
to show a friendlier screen. Both `firestore.rules` and `storage.rules` carry
the same `adminEmails()` list as `src/lib/config.ts`. Deploy them:

```bash
npx firebase deploy --only firestore:rules,storage
```

The rules make the shop public to read and admin-only to change, cap uploads at
50MB, and allow only images and videos. Without this step anyone signed in
could edit the site, so do not skip it.

### 4. Run

```bash
npm install
npm run dev
```

Open `/admin`, sign in with the owner Google account, and start filling in the
page.

## Who can edit the site

Two kinds of admin:

- **Built-in** — the owner (`dprime2002@gmail.com`) and the developer
  (`techubwenge@gmail.com`). They always have access, are listed in
  `adminEmails()` in both rules files, and cannot be removed from the panel.
- **Added** — anyone a built-in admin adds on the **Team** screen. They sign in
  at `/admin` with that Google account and can edit everything, but cannot give
  access to anyone else. Remove them from the same screen and access stops
  immediately.

To add someone: sign in → **Team** → type their Google email → **Add person**.
Nothing needs redeploying; it takes effect straight away.

Changing the built-in list means editing `src/lib/config.ts` **and**
`adminEmails()` in both rules files, then redeploying the rules. Adding someone
from the Team screen needs none of that.

## The site name

`D prime Rwanda LTD` is the starting name — it is the browser tab title and
what shows in the header, footer and admin sidebar. It is only a fallback:
whatever the admin types under **Brand & bar** replaces it everywhere, and the
tab title follows along.

## Deploy

```bash
npm run build
npx firebase deploy
```

Hosting serves `dist` and rewrites all routes to `index.html`, so `/admin`
works on a hard refresh. `vercel.json` does the same for Vercel — without that
rewrite, refreshing `/admin` returns the host's own 404 before the app loads.

On Vercel, set the same `VITE_*` variables from `.env.example` under **Project
settings → Environment variables**, then redeploy — a build without them ships
the setup notice instead of the site.

Whichever host you use, add the live domain under **Authentication → Settings →
Authorized domains** in Firebase, or Google sign-in is rejected there.

## Data

| Collection | Holds |
| --- | --- |
| `settings/site` | One document with everything outside the sections |
| `sections` | Section title, subtitle, picture, columns, visible, order |
| `products` | Items, each with a `media` array of pictures and videos |
| `highlights` | The promises strip |
| `admins` | One document per extra admin, keyed by lowercase email |

## Scripts

```bash
npm run dev      # dev server
npm run build    # typecheck + production build
npm run lint     # eslint
npm run preview  # serve the production build
```
