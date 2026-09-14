import Head from "next/head";
import { useEffect, useState } from "react";
import { Brand, getAnswers, clearAnswers } from "../components/funnel";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function Step8() {
  const [addr, setAddr] = useState("");
  const [firstName, setFirstName] = useState("");
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const a = getAnswers();
    setAddr(a.address || "");
    setFirstName(((a.name || "").trim().split(/\s+/)[0]) || "");
    if (a.lat != null && a.lng != null) setPos({ lat: a.lat, lng: a.lng });

    // Conversion signal for Google Tag Manager (Ads / GA4 / Meta triggers hang off this)
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "lead_submitted",
        funnel: "seller_cash_offer",
        property_type: a.propertyType || null,
        timeline: a.timeline || null,
        condition: a.condition || null,
      });
    } catch (e) {}

    clearAnswers();
  }, []);

  const mapSrc =
    pos && MAPS_KEY
      ? "https://maps.googleapis.com/maps/api/staticmap?center=" + pos.lat + "," + pos.lng +
        "&zoom=19&size=640x220&scale=2&maptype=hybrid&markers=color:red%7C" + pos.lat + "," + pos.lng +
        "&key=" + MAPS_KEY
      : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const colors = ["#6FA3DC", "#00479A", "#0057B8", "#ef4444", "#8b5cf6", "#06b6d4"];
    const parts = [];
    for (let i = 0; i < 150; i++) {
      parts.push({
        x: Math.random() * W,
        y: Math.random() * -H,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        color: colors[(Math.random() * colors.length) | 0],
        vy: 2 + Math.random() * 3,
        vx: -1.2 + Math.random() * 2.4,
        rot: Math.random() * Math.PI,
        vr: -0.12 + Math.random() * 0.24,
      });
    }
    const start = Date.now();
    let raf = 0;
    let cleaned = false;
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
    const draw = () => {
      const elapsed = Date.now() - start;
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.rot += p.vr;
        if (p.y < H + 20) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = elapsed > 3500 ? Math.max(0, 1 - (elapsed - 3500) / 1500) : 1;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (elapsed < 5000 && alive) raf = requestAnimationFrame(draw);
      else cleanup();
    };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(draw);
    return cleanup;
  }, []);

  return (
    <>
      <Head>
        <title>You{"\u2019"}re all set {"\u2014"} Swyft</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="funnel">
        <header className="f-head">
          <a className="brand" href="/">
            <svg className="brand-mark" width="30" height="30" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="24" fill="#0057B8" />
              <path d="M28 11 L16.5 26.5 h7 L20 37 L31.5 21.5 h-7 Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span className="brand-wordmark">SWYFT</span>
          </a>
          <span className="f-secure">Private &amp; no obligation</span>
        </header>

        <main className="f-main done">
          <div className="done-check" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="f-title">You{"\u2019"}re all set{firstName ? `, ${firstName}` : ""}!</h1>
          <p className="f-sub">
            {addr
              ? `We\u2019ve got the details for ${addr}.`
              : "We\u2019ve got your property details."}{" "}
            Your cash offer will be ready <b>within 24 hours</b> {"\u2014"} no obligation to accept it.
          </p>
          {mapSrc ? (
            <>
              <img className="done-map" src={mapSrc} alt={"Satellite view of " + (addr || "your property")} />
              <p className="done-map-cap">{addr}</p>
            </>
          ) : null}
          <div className="f-agent" style={{ marginTop: 22, marginBottom: 0 }}>
            <img className="f-agent-photo" src="/anthony.jpg" alt="Anthony from Swyft" />
            <span><b>Anthony</b> personally reviews every property {"\u2014"} expect a call or email from him, not a call center.</span>
          </div>

          <div className="f-card done-card">
            <h3 className="done-h">What happens next</h3>
            <ol className="done-steps">
              <li>
                <b>We run your numbers</b>
                <span>We pull comparable sales in your neighborhood and price the repairs {"\u2014"} today.</span>
              </li>
              <li>
                <b>A quick call to confirm details</b>
                <span>Usually under five minutes. No walkthrough needed to get your offer.</span>
              </li>
              <li>
                <b>Your cash offer, in writing</b>
                <span>Within 24 hours. Accept it, shop it around, or file it away {"\u2014"} entirely your call.</span>
              </li>
            </ol>
          </div>

          <div className="done-tip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.3 0 .7-.2 1l-2.2 2Z" />
            </svg>
            <span>
              <b>One quick favor</b>
              Our call may show as an unknown number. Answering the first time is the fastest way to get your offer.
            </span>
          </div>

          <a className="done-home" href="/">Back to Swyft home</a>
        </main>

        <footer className="f-foot">
          {"\u00A9"} {new Date().getFullYear()} Swyft Home Buyers {"\u00B7"} Indianapolis {"\u00B7"} Cleveland {"\u00B7"} Columbus {"\u00B7"} St. Louis
        </footer>

      </div>
    </>
  );
}
