import Head from "next/head";
import { useEffect, useState } from "react";
import { Brand, getAnswers, clearAnswers } from "../components/funnel";

export default function Step8() {
  const [addr, setAddr] = useState("");

  useEffect(() => {
    const a = getAnswers();
    setAddr(a.address || "");
    clearAnswers();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const colors = ["#0057B8", "#16a34a", "#FFC421", "#ef4444", "#8b5cf6", "#06b6d4"];
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
          <Brand />
          <span className="f-secure">Private &amp; no obligation</span>
        </header>

        <main className="f-main done">
          <div className="done-check" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="f-title">You{"\u2019"}re all set!</h1>
          <p className="f-sub">
            Thanks{addr ? ` \u2014 we\u2019ve got the details for ${addr}.` : "."} An investor will review
            your property and reach out shortly with a no-obligation cash offer.
          </p>
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
          {"\u00A9"} {new Date().getFullYear()} Swyft Home Buyers {"\u00B7"} Perris &amp; the Inland Empire
        </footer>
      </div>
    </>
  );
}
