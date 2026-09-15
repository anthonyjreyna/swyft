// TEMPORARY DIAGNOSTIC — visit /api/encharge-test in a browser.
// Sends one fake lead to Encharge and shows exactly what Encharge replies.
// Delete this file once Encharge is confirmed working.

export default async function handler(req, res) {
  const key = process.env.ENCHARGE_WRITE_KEY;

  if (!key) {
    return res.status(200).json({
      step: "env",
      keyPresent: false,
      message:
        "ENCHARGE_WRITE_KEY is NOT visible to this deployment. Add it in Vercel, then redeploy.",
    });
  }

  const payload = {
    name: "Cash Offer Requested",
    user: {
      email: "encharge-test@swyftholdings.com",
      firstName: "Test",
      lastName: "Lead",
      phone: "+15555550123",
      propertyAddress: "123 Test St, Indianapolis, IN 46205",
      tags: "seller-lead, swyft-funnel, test",
    },
    properties: {
      address: "123 Test St, Indianapolis, IN 46205",
      propertyType: "Single-family home",
      bedrooms: "3",
      bathrooms: "2",
      condition: "Needs some work",
      timeline: "ASAP",
      phoneVerified: true,
      submittedAt: new Date().toISOString(),
    },
  };

  try {
    const r = await fetch("https://ingest.encharge.io/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Encharge-Token": key },
      body: JSON.stringify(payload),
    });
    const body = await r.text().catch(() => "");
    return res.status(200).json({
      step: "encharge",
      keyPresent: true,
      keyLength: key.length,
      keyStartsWith: key.slice(0, 4),
      enchargeStatus: r.status,
      enchargeOk: r.ok,
      enchargeBody: body.slice(0, 1000),
      sentPayload: payload,
    });
  } catch (e) {
    return res.status(200).json({
      step: "encharge",
      keyPresent: true,
      networkError: String(e && e.message ? e.message : e),
    });
  }
}
