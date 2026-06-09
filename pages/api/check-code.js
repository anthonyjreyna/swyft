// Checks an SMS code via Twilio Verify. Returns { approved: true } only when
// Twilio confirms the code. Same env vars as send-code.js.

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

  const body0 = req.body || {};
  const to = normalizeE164(body0.phone);
  const code = ("" + (body0.code || "")).replace(/\D/g, "");
  if (!to || !code) return res.status(400).json({ error: "bad-input" });

  try {
    const auth = Buffer.from(sid + ":" + token).toString("base64");
    const body = new URLSearchParams({ To: to, Code: code }).toString();
    const r = await fetch(
      "https://verify.twilio.com/v2/Services/" + service + "/VerificationCheck",
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
      return res.status(200).json({ approved: false });
    }
    return res.status(200).json({ approved: data.status === "approved", status: data.status });
  } catch (e) {
    return res.status(500).json({ error: "server" });
  }
}
