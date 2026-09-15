// Delivers each verified funnel lead to three places, independently:
//   1. Encharge  — REST /people, key as ?api_key=      (ENCHARGE_WRITE_KEY)
//   2. Webhook   — any automation platform             (LEAD_WEBHOOK_URL)
//   3. Email     — via your own Gmail                  (GMAIL_USER + GMAIL_APP_PASSWORD)
// Any one failing never blocks the others, and never blocks the seller.

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.LEAD_EMAIL || user;

  const lead = req.body || {};
  const parts = String(lead.name || "").trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  const mapUrl =
    lead.lat != null && lead.lng != null
      ? "https://www.google.com/maps?q=" + lead.lat + "," + lead.lng + "&t=k"
      : null;

  // ---------- 1. Encharge ----------
  const enchargeKey = process.env.ENCHARGE_API_KEY || process.env.ENCHARGE_WRITE_KEY;
  if (enchargeKey && (lead.email || lead.phone)) {
    const person = {
      email: lead.email || undefined,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phone: lead.phone || undefined,
      tags: "seller-lead, swyft-funnel",
      // custom fields — Encharge creates these on first use
      propertyAddress: lead.address || undefined,
      propertyType: lead.propertyType || undefined,
      bedrooms: lead.bedrooms || undefined,
      bathrooms: lead.bathrooms || undefined,
      propertyCondition: lead.condition || undefined,
      sellingTimeline: lead.timeline || undefined,
      squareFootage: lead.squareFootage != null ? lead.squareFootage : undefined,
      yearBuilt: lead.yearBuilt != null ? lead.yearBuilt : undefined,
      satelliteMapUrl: mapUrl || undefined,
      phoneVerified: true,
      leadSubmittedAt: new Date().toISOString(),
    };
    try {
      await fetch(
        "https://api.encharge.io/v1/people?api_key=" + encodeURIComponent(enchargeKey),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        }
      );
    } catch (e) {}
  }

  // ---------- 2. Automation webhook ----------
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "swyft-funnel",
          submittedAt: new Date().toISOString(),
          name: lead.name || "",
          firstName,
          phone: lead.phone || "",
          email: lead.email || "",
          address: lead.address || "",
          propertyType: lead.propertyType || "",
          bedrooms: lead.bedrooms || "",
          bathrooms: lead.bathrooms || "",
          condition: lead.condition || "",
          timeline: lead.timeline || "",
          lat: lead.lat != null ? lead.lat : null,
          lng: lead.lng != null ? lead.lng : null,
        }),
      });
    } catch (e) {}
  }

  // ---------- 3. Email notification ----------
  if (!user || !pass) {
    const delivered = Boolean(hook || enchargeKey);
    return res
      .status(delivered ? 200 : 503)
      .json(delivered ? { ok: true, via: hook ? "webhook" : "encharge" } : { error: "not-configured" });
  }

  const esc = (v) =>
    String(v == null ? "" : v).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

  const rows = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Address", lead.address],
    ["Property type", lead.propertyType],
    ["Bedrooms", lead.bedrooms],
    ["Bathrooms", lead.bathrooms],
    ["Condition", lead.condition],
    ["Timeline", lead.timeline],
    ["Sq ft (records)", lead.squareFootage],
    ["Year built (records)", lead.yearBuilt],
    ["Lot size (records)", lead.lotSize],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        '<tr><td style="padding:6px 14px 6px 0;color:#5B5E63;font-size:13px;white-space:nowrap">' +
        k +
        '</td><td style="padding:6px 0;font-size:14px;color:#16191D"><b>' +
        esc(v) +
        "</b></td></tr>"
    )
    .join("");

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: '"Swyft Leads" <' + user + ">",
      to,
      replyTo: lead.email || undefined,
      subject: "New cash offer lead — " + (lead.address || "address pending"),
      html:
        '<div style="font-family:system-ui,sans-serif;max-width:520px">' +
        '<h2 style="margin:0 0 4px">New seller lead (phone verified)</h2>' +
        '<p style="margin:0 0 16px;color:#5B5E63;font-size:13px">Submitted via the Swyft funnel</p>' +
        "<table>" + rows + "</table>" +
        (mapUrl ? '<p style="margin-top:14px"><a href="' + mapUrl + '">View property on Google Maps</a></p>' : "") +
        "</div>",
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: "send-failed" });
  }
}
