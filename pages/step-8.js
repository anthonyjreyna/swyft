import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Brand, getAnswers, clearAnswers } from "../components/funnel";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function Step8() {
  const [addr, setAddr] = useState("");
  const [firstName, setFirstName] = useState("");
  const [pos, setPos] = useState(null);
  const [showBar, setShowBar] = useState(false);
  const callRef = useRef(null);

  useEffect(() => {
    const el = callRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setShowBar(!entries[0].isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const a = getAnswers();
    setAddr(a.address || "");
    setFirstName(((a.name || "").trim().split(/\s+/)[0]) || "");
    if (a.lat != null && a.lng != null) setPos({ lat: a.lat, lng: a.lng });
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
      <Head><title>Thank you — Swyft</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
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
            Thanks{addr ? ` \u2014 we\u2019ve got the details for ${addr}.` : "."} An investor will review
            your property and reach out shortly with a no-obligation cash offer.
          </p>
          {mapSrc ? (
            <>
              <img className="done-map" src={mapSrc} alt={"Satellite view of " + (addr || "your property")} />
              <p className="done-map-cap">{addr}</p>
            </>
          ) : null}
          <div className="f-agent" style={{ marginTop: 22, marginBottom: 0 }}>
            <img className="f-agent-photo" src="/anthony.jpg" alt="Anthony from Swyft" />
            <span><b>Anthony</b> will personally call you shortly from a local number \u2014 keep an eye on your phone.</span>
          </div>
          <a className="done-call" href="tel:+19515550190" ref={callRef}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 15.5c-1.2 0-2.4-.2-3.5-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1C8.7 8.4 8.5 7.2 8.5 6c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg>
            Or call Anthony now {"\u2014"} (951) 555-0190
          </a>
          <p className="done-call-note">Tap to call from your phone {"\u00B7"} Mon{"\u2013"}Sat, 8am{"\u2013"}7pm</p>
          <div className="f-card done-card">
            <h3 className="done-h">What happens next</h3>
            <ol className="done-list">
              <li>We match your property to investors in your area.</li>
              <li>You{"\u2019"}ll get a call or email to confirm a few details.</li>
              <li>You receive your cash offer — no obligation to accept.</li>
            </ol>
          </div>
        </main>

        <footer className="f-foot">
          {"\u00A9"} {new Date().getFullYear()} Swyft Home Buyers {"\u00B7"} Indianapolis {"\u00B7"} Cleveland {"\u00B7"} Columbus {"\u00B7"} St. Louis
        </footer>

        <div className={"done-sticky" + (showBar ? " show" : "")} aria-hidden={!showBar}>
          <a className="done-call" href="tel:+19515550190">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 15.5c-1.2 0-2.4-.2-3.5-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1C8.7 8.4 8.5 7.2 8.5 6c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg>
            Call Anthony {"\u2014"} (951) 555-0190
          </a>
        </div>
      </div>
    </>
  );
}
