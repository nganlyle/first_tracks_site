# First Tracks — direct booking site

A free, static site for your Big White condo, built to run on GitHub Pages.
The availability calendar syncs from your Airbnb iCal feed automatically
every 6 hours via a GitHub Action — no Lodgify, no booking fees, no
payment processor cut.

## 1. Create the repo

1. On GitHub, create a new repository (e.g. `first-tracks-site`).
2. Upload all the files in this folder, keeping the folder structure
   exactly as-is (including the `.github/workflows` folder — some file
   browsers hide dot-folders, so if you're dragging files in through the
   GitHub web UI, upload that folder separately to make sure it comes
   through).

## 2. Add your real contact info

Open `index.html` and replace:

- `youremail@example.com` (in the "Email to book" button) with your real
  email address.

## 3. Add your own photos

Airbnb's photo URLs aren't meant for outside use, so drop your own photos
into `assets/photos/`, named to match what `index.html` expects:

- `assets/photos/living-room.jpg`
- `assets/photos/sauna.jpg`
- `assets/photos/bedroom.jpg`

(Or rename the files however you like — just update the matching `src=`
paths in the `<section class="gallery">` block in `index.html`.)

## 4. Get your Airbnb iCal export link

1. In Airbnb, go to **Calendar** → select your listing → **Availability
   settings** (or **Sync calendars**) → **Export calendar**.
2. Copy the `.ics` link Airbnb gives you. Keep this private — anyone with
   the link can see your booking calendar.

## 5. Add the iCal link as a repo secret

Don't paste the iCal URL directly into any file — it's meant to stay
private, and repo secrets keep it out of your commit history.

1. In your GitHub repo, go to **Settings** → **Secrets and variables** →
   **Actions**.
2. Click **New repository secret**.
3. Name: `AIRBNB_ICAL_URL`
4. Value: paste the `.ics` link from step 4.
5. Save.

## 6. Turn on GitHub Pages

1. In your repo, go to **Settings** → **Pages**.
2. Under "Build and deployment," set **Source** to **Deploy from a
   branch**.
3. Pick your default branch (usually `main`) and the `/ (root)` folder.
4. Save. GitHub will give you a URL like
   `https://yourusername.github.io/first-tracks-site/` within a minute or
   two.

## 7. Run the calendar sync once manually

The Action runs automatically every 6 hours, but you don't have to wait
for the first sync:

1. Go to the **Actions** tab in your repo.
2. Click **Sync Airbnb Calendar** in the sidebar.
3. Click **Run workflow** → **Run workflow**.
4. After it finishes (usually under a minute), refresh your site — the
   calendar should now show your real booked dates.

## How the double-booking protection works

This site only reads your Airbnb calendar — it doesn't write back to it.
That means when a guest books directly through your site, **you still
need to manually block those dates in Airbnb** the moment you confirm the
booking. That one habit is what prevents a double booking. Once you do,
the next sync (within 6 hours, or immediately if you re-run the Action
manually) will reflect it here too.

## Optional: custom domain

If you'd like something like `www.firsttracksbigwhite.com` instead of the
default `github.io` address, GitHub Pages supports custom domains for
free — you just need to buy the domain elsewhere (e.g. Namecheap,
Google Domains) and point its DNS at GitHub. Ask if you'd like the exact
steps for this.
