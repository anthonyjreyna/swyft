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
  if (!user || !pass) return res.status(503).json({ error: "not-configured" });

  const lead = req.body || {};
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
