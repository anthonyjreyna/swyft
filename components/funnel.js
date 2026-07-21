import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const STORE_KEY = "offer_funnel_v1";
export const TOTAL_STEPS = 7;

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export function getAnswers() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

export function setAnswer(key, value) {
  if (typeof window === "undefined") return;
  const a = getAnswers();
  a[key] = value;
  sessionStorage.setItem(STORE_KEY, JSON.stringify(a));
}

export function clearAnswers() {
  if (typeof window !== "undefined") sessionStorage.removeItem(STORE_KEY);
}

export function Brand() {
  return (
    <Link className="brand" href="/">
      <svg className="brand-mark" width="30" height="30" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="24" fill="#0057B8" />
        <path d="M28 11 L16.5 26.5 h7 L20 37 L31.5 21.5 h-7 Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      Swyft
    </Link>
  );
}

export function BackLink() {
  const router = useRouter();
  return (
    <button className="f-back" type="button" onClick={() => router.back()}>
      {"\u2190"} Back
    </button>
  );
}

// Static satellite thumbnail of the selected home, shown on every step after 1.
export function HomeImage() {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    const a = getAnswers();
    if (a.lat != null && a.lng != null) {
      setPos({ lat: a.lat, lng: a.lng, address: a.address || "" });
    }
  }, []);
  if (!pos || !MAPS_KEY) return null;
  const src =
    "https://maps.googleapis.com/maps/api/staticmap?center=" +
    pos.lat + "," + pos.lng +
    "&zoom=19&size=600x180&scale=2&maptype=hybrid&markers=color:red%7C" +
    pos.lat + "," + pos.lng +
    "&key=" + MAPS_KEY;
  return (
    <div style={{ marginTop: 16 }}>
      <img
        src={src}
        alt={"Satellite view of " + (pos.address || "your home")}
        style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12, border: "1px solid var(--line)", display: "block" }}
      />
      {pos.address ? (
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, textAlign: "center" }}>{pos.address}</div>
      ) : null}
    </div>
  );
}



export function FunnelLayout({ step, title, subtitle, children }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="funnel">
      <header className="f-head">
        <Brand />
        <span className="f-secure">Private &amp; no obligation</span>
      </header>

      <div className="f-progress">
        <div className="f-bar" style={{ width: pct + "%" }} />
      </div>

      <main className="f-main">
        <div className="f-stepno">Step {step} of {TOTAL_STEPS}</div>
        <h1 className="f-title">{title}</h1>
        {subtitle ? <p className="f-sub">{subtitle}</p> : null}
        {step > 1 ? <HomeImage /> : null}
        <div className="f-card">{children}</div>
      </main>

      <footer className="f-foot">
        {"\u00A9"} {new Date().getFullYear()} Swyft Home Buyers {"\u00B7"} Indianapolis {"\u00B7"} Cleveland {"\u00B7"} Columbus {"\u00B7"} St. Louis
      </footer>
    </div>
  );
}

export function Choices({ name, options, next }) {
  const router = useRouter();
  const pick = (val) => {
    setAnswer(name, val);
    router.push(next);
  };
  return (
    <>
      <div className="choices">
        {options.map((o) => (
          <button className="choice" key={o} type="button" onClick={() => pick(o)}>
            <span>{o}</span>
            <span className="choice-arrow">{"\u2192"}</span>
          </button>
        ))}
      </div>
      <BackLink />
    </>
  );
}
