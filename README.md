# Vellvia v7 - local review build (NOT published)

Static Hebrew/English travel planner. No external runtime dependencies.
Serve this folder with a static server or open index.html in Chrome.
Approved v6 globe entrance and bilingual button are preserved.

Trip data uses vellvia.trips.v1 in localStorage. Language uses vellvia.language.v1.
The sticky "Back to trips" control is clearer and visible during scroll.
There is no browser-history routing. Back to welcome is unchanged.
Each trip now has Itinerary, Useful links and Documents panels.
All app-owned text is in i18n.js; user text is never auto-translated.

Documents store actual PDF/JPG/PNG blobs in IndexedDB, database
vellvia.documents.v1. The product limit is 10,000,000 bytes per file and
50,000,000 bytes across every trip. A basic file-header/type check is used.
This is not antivirus scanning or encrypted storage. Confirmation of saving
happens only after the IndexedDB transaction completes. Size/quota/write failures
are handled visibly. Estimated free space is checked when the browser supports
it. If unavailable, the save transaction remains authoritative.
Files can open in a new tab, download, or be deleted after confirmation.
Keep original files: clearing site data, private browsing, storage eviction or
switching browsers/devices/domains can lose access. No cloud/sync/sharing/backup.
Anyone using the browser profile can see the data. Not a vault for secrets.

Useful links do not send trip destination/date data and have no assumed origin.
No affiliate tags are added. Provider services can charge even though this site
has no service cost. Before-trip passport link intentionally leads to the
Population Authority homepage with its "passport application" entry: the older
apply_for_passport deep URL currently redirects to an error. Google's Android
eSIM guide is specifically for Pixel; other Android devices can differ.
Lupa photo albums are After the trip, not lodging. No automatic payments.

No seeded trips or files. Demo records exist only in temporary preview browsers.
No account/authentication backend or document uploads to GitHub/server.
No destination-name dictionary or automatic destination translation.
Current review build is local only. Published site remains v6 until authorized.
