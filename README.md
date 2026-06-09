# HomeOffer — investor cash-offer quiz funnel

An original multi-step lead funnel (placeholder brand "HomeOffer"). Each step is
its own page; answers carry across pages and the full lead is saved to Firebase
at the contact step.

## Steps
```
pages/index.js   Step 1  property address
pages/step-2.js  Step 2  property type
pages/step-3.js  Step 3  bedrooms
pages/step-4.js  Step 4  bathrooms
pages/step-5.js  Step 5  condition
pages/step-6.js  Step 6  timeline
pages/step-7.js  Step 7  contact info  -> saves lead to Firebase
pages/step-8.js  Step 8  thank-you / confirmation
components/funnel.js  shared layout, progress bar, choice buttons, answer storage
lib/firebase.js       Firebase init + saveLead() helper
```

## Works immediately
Deploy as-is and the whole funnel runs. Until you add Firebase config, leads
simply are not saved (the funnel still completes).

## Address autocomplete + map (Google)
Step 1 shows a map and live Google address suggestions when a Maps key is
present. Pick an address and the map flies to a satellite (hybrid) view of the
home with a marker; Next carries the address forward. Add an environment
variable in Vercel named `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (value = your Google
Maps Platform API key), then redeploy. Without it, the address field is a normal
text box (no map) and the funnel still works. The key needs the "Maps JavaScript
API" and "Places API (New)" enabled, billing active, and website (HTTP referrer)
restrictions set to your domains.

## Turn on lead capture
1. Create a Firebase project, enable Firestore (production mode).
2. Project settings -> Your apps -> web app -> copy the config.
3. Paste those values into `lib/firebase.js` (replace each "REPLACE_ME").
4. Publish these Firestore rules (Firestore -> Rules -> Publish):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{id} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```
This lets the public submit leads but keeps them private — you read submissions
in the Firebase console (Firestore -> Data -> leads). No login needed in the app.

## Rename the brand
"HomeOffer" lives in `components/funnel.js` (Brand + footer) and the page
titles. Swap it for your real name when ready.
