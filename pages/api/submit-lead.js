// Emails each completed funnel lead to you through YOUR OWN Gmail account.
// Env vars (set in Vercel):
//   GMAIL_USER          - your Gmail address (the sender)
//   GMAIL_APP_PASSWORD  - a Google "App Password" (16 chars, no spaces)
//   LEAD_EMAIL          - optional; where leads go. Defaults to GMAIL_USER.
// Returns 503 when not configured so the funnel never blocks a seller.

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.LEAD_EMAIL || user;

  const lead = req.body || {};

  // --- Encharge (marketing automation) -------------------------------------
  // Set ENCHARGE_WRITE_KEY in Vercel. Get it at app.encharge.io/account/info.
  // Fire-and-forget: an Encharge failure never blocks the lead or the email.
  const enchargeKey = process.env.ENCHARGE_WRITE_KEY;
  if (enchargeKey && (lead.email || lead.phone)) {
    const parts = String(lead.name || "").trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    try {
      await fetch("https://ingest.encharge.io/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Encharge-Token": enchargeKey },
        body: JSON.stringify({
          name: "Cash Offer Requested",
          user: {
            email: lead.email || undefined,
            userId: lead.email ? undefined : String(lead.phone),
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phone: lead.phone || undefined,
            propertyAddress: lead.address || undefined,
            tags: "seller-lead, swyft-funnel",
          },
          properties: {
            address: lead.address || null,
            propertyType: lead.propertyType || null,
            bedrooms: lead.bedrooms || null,
            bathrooms: lead.bathrooms || null,
            condition: lead.condition || null,
            timeline: lead.timeline || null,
            squareFootage: lead.squareFootage != null ? lead.squareFootage : null,
            yearBuilt: lead.yearBuilt != null ? lead.yearBuilt : null,
            phoneVerified: true,
            submittedAt: new Date().toISOString(),
            mapUrl:
              lead.lat != null && lead.lng != null
                ? "https://www.google.com/maps?q=" + lead.lat + "," + lead.lng + "&t=k"
                : null,
          },
        }),
      });
    } catch (e) {}
  }

  // Forward the lead to an automation platform (SMS workflows, CRM, etc.)
  // Set LEAD_WEBHOOK_URL in Vercel to your automation's inbound webhook URL.
  // Fire-and-forget: a webhook failure never blocks the lead or the email.
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
          firstName: ((lead.name || "").trim().split(/\s+/)[0]) || "",
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

  if (!user || !pass) {
    // No email configured — but if a webhook or Encharge fired, the lead still got through.
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

  const mapLink =
    lead.lat != null && lead.lng != null
      ? '<p style="margin-top:14px"><a href="https://www.google.com/maps?q=' +
        lead.lat + "," + lead.lng + '&t=k">View property on Google Maps</a></p>'
      : "";

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: '"Swyft Leads" <' + user + ">",
      to,
      replyTo: lead.email || undefined,
      subject: "New cash offer lead — " + (lead.address || "address pending"),
      html:
        '<div style="font-family:system-ui,sans-serif;max-width:520px">' +
        '<h2 style="margin:0 0 4px">New seller lead (phone verified)</h2>' +
        '<p style="margin:0 0 16px;color:#5B5E63;font-size:13px">Submitted via the Swyft funnel</p>' +
        "<table>" + rows + "</table>" + mapLink + "</div>",
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: "send-failed" });
  }
}
