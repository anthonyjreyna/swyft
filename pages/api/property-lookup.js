// Looks up public-records data for an address via the RentCast API.
// Env var (set in Vercel): RENTCAST_API_KEY  — free plan: 50 requests/month.
// Returns 200 with whatever fields exist, or 204/503 without ever blocking the funnel.

export default async function handler(req, res) {
  const key = process.env.RENTCAST_API_KEY;
  const address = (req.query.address || "").toString().trim();
  if (!key) return res.status(503).json({ error: "not-configured" });
  if (!address) return res.status(400).json({ error: "address-required" });

  try {
    const r = await fetch(
      "https://api.rentcast.io/v1/properties?address=" + encodeURIComponent(address),
      { headers: { "X-Api-Key": key, Accept: "application/json" } }
    );
    if (!r.ok) return res.status(204).end();
    const data = await r.json();
    const p = Array.isArray(data) ? data[0] : data;
    if (!p) return res.status(204).end();

    res.setHeader("Cache-Control", "private, max-age=3600");
    return res.status(200).json({
      propertyType: p.propertyType || null,
      bedrooms: p.bedrooms != null ? p.bedrooms : null,
      bathrooms: p.bathrooms != null ? p.bathrooms : null,
      squareFootage: p.squareFootage != null ? p.squareFootage : null,
      yearBuilt: p.yearBuilt != null ? p.yearBuilt : null,
      lotSize: p.lotSize != null ? p.lotSize : null,
    });
  } catch (e) {
    return res.status(204).end();
  }
}
