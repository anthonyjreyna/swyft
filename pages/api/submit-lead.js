// Emails each completed funnel lead to you via Resend.
// Env vars (set in Vercel): RESEND_API_KEY, LEAD_EMAIL (where leads are sent).
// Returns 503 when not configured so the funnel never blocks a seller.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL;
  if (!key || !to) return res.status(503).json({ error: "not-configured" });

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
        lead.lat + "," + lead.lng +
        '&t=k">View property on Google Maps</a></p>'
      : "";

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Swyft Leads <onboarding@resend.dev>",
        to: [to],
        reply_to: lead.email || undefined,
        subject: "New cash offer lead — " + (lead.address || "address pending"),
        html:
          '<div style="font-family:system-ui,sans-serif;max-width:520px">' +
          '<h2 style="margin:0 0 4px">New seller lead (phone verified)</h2>' +
          '<p style="margin:0 0 16px;color:#5B5E63;font-size:13px">Submitted via swyftholdings.com funnel</p>' +
          "<table>" + rows + "</table>" + mapLink + "</div>",
      }),
    });
    if (!r.ok) return res.status(502).json({ error: "send-failed" });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "server" });
  }
}
