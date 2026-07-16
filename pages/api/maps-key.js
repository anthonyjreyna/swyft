// Supplies the public Google Maps key to the static landing page.
// NEXT_PUBLIC_* keys are already exposed in the client bundle, so this
// endpoint reveals nothing that isn't public — it just makes the key
// reachable from landing.html at runtime.
export default function handler(req, res) {
  res.status(200).json({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" });
}
