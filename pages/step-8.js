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

  return (
    <>
      <Head><title>Thank you — HomeOffer</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
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
          {"\u00A9"} {new Date().getFullYear()} HomeOffer {"\u00B7"} Placeholder brand {"\u2014"} rename anytime.
        </footer>
      </div>
    </>
  );
}
