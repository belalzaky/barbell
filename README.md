# Barbell

A workout tracker that runs the session rather than logging it. It tells you the
next set, you tap once to confirm, the rest timer starts itself. Weights are
tracked against the specific physical machine you used, because 60 kg on a
Hammer Strength row is not 60 kg on a Prime row.

Free, offline, no account, no backend. Everything lives on your device.

## Deploying an update

1. Edit `index.html`.
2. Bump `V` in `sw.js` (e.g. `barbell-2026-08-06a`) and `BUILD` in `index.html`.
   **This is the step that matters** — without it the old cached version keeps
   serving and nothing changes on the phone.
3. Commit and push. GitHub Pages redeploys in about a minute.
4. Open the app. A "New version ready" banner appears; tap Reload.

The banner never interrupts a live session — a new worker is held back until
you tap, so an update can't swap in mid-set.

## Your data

Stored in `localStorage`, keyed to this exact origin. **Never move the app to a
different URL** — the data does not travel with it. Settings → Back up to a file
is the only copy that exists off-device.
