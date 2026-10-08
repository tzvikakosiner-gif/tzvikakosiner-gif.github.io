# Vellvia local trip planner

Serve this folder with a static server or open index.html in Chrome.
Zero runtime dependencies, external requests, cloud services or costs.

Entrance and button design remain from the approved previous version.
Create a trip using any destination and a start/end date. A day is created for
all dates inclusive. Each day has editable place and notes fields.
Trips and day edits save immediately to localStorage on this browser only.
Reopen the trip from the trip list. No starter trips are included.
Dates support 1900-2200 with a maximum 366 days per trip.

No login, private accounts, cloud synchronization, invitations or sharing.
Anyone using the same browser profile can read these local trips.
Clearing browser data removes the trips. No automatic backup.
Do not use this version for sensitive documents, ticket numbers or secrets.
Storage failures are shown and leave current edits in memory only.
No documents/upload feature is provided yet.

The preview screenshots/video use a fictitious Japan trip to demonstrate the
flow. These demonstration records are not included in this source archive.
The SVG logo is reconstructed from the supplied reference, not its lost master.
Nothing has been pushed or published. No credentials are included.

## Languages (v5)
Hebrew is the default, with English selectable on welcome and inside the app.
The preference is saved separately at vellvia.language.v1.
All app-owned strings and accessibility labels are in i18n.js.
To add a language, add a LANGUAGES entry with dir, locale, name and text values.
Missing keys fall back to Hebrew. Dates/weekday names use the selected locale.
Native date input controls still use the browser/operating system date format.
Trip names, places and notes are user data and are not translated.
Switching languages preserves unfinished form fields and stored trips.
The fixed 120x44 entrance button runs a 12-second Hebrew/English letter dissolve
loop using "מתחילים מסע" and "Start your journey". Reduced-motion users get a
static label in the selected language. Entrance artwork does not mirror.

## Full entrance preview (v6)
The original globe-targeted zoom is retained and tested from a real enter click.
Full preview videos show one bilingual loop, a click, the globe zoom, then home.
Language picker fades with the entrance controls during zoom.
Reset clears the flash and restores the language picker on returning to welcome.
No destination-name auto-translation has been added.
