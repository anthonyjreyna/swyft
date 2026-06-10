import Link from "next/link";
import { useRouter } from "next/router";

const STORE_KEY = "offer_funnel_v1";
export const TOTAL_STEPS = 7;

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
      <span className="brand-mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 11l9-7 9 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10v9h14v-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      HomeOffer
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
        <div className="f-card">{children}</div>
      </main>

      <footer className="f-foot">
        {"\u00A9"} {new Date().getFullYear()} HomeOffer {"\u00B7"} Placeholder brand {"\u2014"} rename anytime.
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
