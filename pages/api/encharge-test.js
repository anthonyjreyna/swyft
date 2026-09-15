// TEMPORARY DIAGNOSTIC — visit /api/encharge-test in a browser.
// Delete this file once Encharge is confirmed working.

const PERSON = {
  email: "encharge-test@swyftholdings.com",
  firstName: "Test",
  lastName: "Lead",
  phone: "+15555550123",
  tags: "seller-lead, swyft-funnel, test",
};

async function attempt(label, url, body, method) {
  try {
    const r = await fetch(url, {
      method: method || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await r.text().catch(() => "");
    return { label, status: r.status, ok: r.ok, body: text.slice(0, 400) };
  } catch (e) {
    return { label, error: String(e && e.message ? e.message : e) };
  }
}

export default async function handler(req, res) {
  const key = process.env.ENCHARGE_API_KEY || process.env.ENCHARGE_WRITE_KEY;
  if (!key) return res.status(200).json({ keyPresent: false });

  const q = "?api_key=" + encodeURIComponent(key);
  const base = "https://api.encharge.io/v1";
  const results = [];

  // A. people, key in URL, users array (documented shape)
  results.push(await attempt("people_array", base + "/people" + q, { users: [PERSON] }));

  // B. people, key in URL, single object
  results.push(await attempt("people_object", base + "/people" + q, PERSON));

  // C. people via PUT (upsert semantics in some versions)
  results.push(await attempt("people_put", base + "/people" + q, { users: [PERSON] }, "PUT"));

  // D. ingest endpoint with key in URL (docs mention this CORS workaround)
  results.push(
    await attempt("ingest_url_key", "https://ingest.encharge.io/v1/" + encodeURIComponent(key), {
      name: "Cash Offer Requested",
      user: PERSON,
      properties: { address: "123 Test St, Indianapolis, IN 46205" },
    })
  );

  return res.status(200).json({
    keyPresent: true,
    usingVar: process.env.ENCHARGE_API_KEY ? "ENCHARGE_API_KEY" : "ENCHARGE_WRITE_KEY",
    results,
    readMe: "Look for the first result with ok:true.",
  });
}
