// Sends an SMS verification code via Twilio Verify. The Twilio secrets live
// only here on the server (set them as environment variables in Vercel):
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID
// If they are not set, this returns 503 so the funnel can proceed un-gated
// until you finish the Twilio setup.

function normalizeE164(phone) {
  if (!phone) return "";
  const raw = ("" + phone).trim();
  const d = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) return "+" + d;
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d[0] === "1") return "+" + d;
  return "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const service = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!sid || !token || !service) {
    return res.status(503).json({ error: "not-configured" });
  }

  const to = normalizeE164((req.body || {}).phone);
  if (!to) return res.status(400).json({ error: "bad-phone" });

  try {
    const auth = Buffer.from(sid + ":" + token).toString("base64");
    const body = new URLSearchParams({ To: to, Channel: "sms" }).toString();
    const r = await fetch(
      "https://verify.twilio.com/v2/Services/" + service + "/Verifications",
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );
    const data = await r.json();
    if (!r.ok) {
      return res.status(502).json({ error: "send-failed", detail: data.message || "" });
    }
    return res.status(200).json({ ok: true, status: data.status, to });
  } catch (e) {
    return res.status(500).json({ error: "server" });
  }
}
