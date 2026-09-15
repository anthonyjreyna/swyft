// TEMPORARY DIAGNOSTIC — visit /api/encharge-test in a browser.
// Tries every Encharge entry point and reports which one your plan allows.
// Delete this file once Encharge is confirmed working.

const PERSON = {
  email: "encharge-test@swyftholdings.com",
  firstName: "Test",
  lastName: "Lead",
  phone: "+15555550123",
};

async function attempt(label, url, key, body) {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Encharge-Token": key },
      body: JSON.stringify(body),
    });
    const text = await r.text().catch(() => "");
    return { label, url, status: r.status, ok: r.ok, body: text.slice(0, 400) };
  } catch (e) {
    return { label, url, error: String(e && e.message ? e.message : e) };
  }
}

export default async function handler(req, res) {
  const key = process.env.ENCHARGE_API_KEY || process.env.ENCHARGE_WRITE_KEY;
  if (!key) {
    return res.status(200).json({
      keyPresent: false,
      message: "No ENCHARGE_WRITE_KEY or ENCHARGE_API_KEY visible to this deployment.",
    });
  }

  const results = [];

  // 1. Ingest API (known to be plan-gated on some accounts)
  results.push(
    await attempt("ingest", "https://ingest.encharge.io/v1", key, {
      name: "Cash Offer Requested",
      user: { ...PERSON, tags: "seller-lead, swyft-funnel, test" },
      properties: { address: "123 Test St, Indianapolis, IN 46205" },
    })
  );

  // 2. REST API — upsert the person
  results.push(
    await attempt("rest_people", "https://api.encharge.io/v1/people", key, {
      users: [{ ...PERSON, tags: "seller-lead, swyft-funnel, test" }],
    })
  );

  // 3. REST API — record an event for that person
  results.push(
    await attempt("rest_events", "https://api.encharge.io/v1/events", key, {
      name: "Cash Offer Requested",
      user: { email: PERSON.email },
      properties: { address: "123 Test St, Indianapolis, IN 46205", timeline: "ASAP" },
    })
  );

  return res.status(200).json({
    keyPresent: true,
    keyLength: key.length,
    usingVar: process.env.ENCHARGE_API_KEY ? "ENCHARGE_API_KEY" : "ENCHARGE_WRITE_KEY",
    results,
    readMe:
      "Look for the first result with ok:true — that's the endpoint your plan allows.",
  });
}
