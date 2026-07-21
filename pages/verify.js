import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Brand, getAnswers } from "../components/funnel";
import { saveLead } from "../lib/firebase";

export default function Verify() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("send"); // send | enter
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const a = getAnswers();
    if (!a.phone) {
      router.replace("/step-7");
      return;
    }
    setPhone(a.phone);
  }, [router]);

  const finishAndContinue = async () => {
    const answers = getAnswers();
    try {
      await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
    } catch (e) {}
    try {
      await saveLead(answers);
    } catch (e) {}
    router.push("/step-8");
  };

  const sendCode = async () => {
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (r.status === 503) {
        // Twilio not set up yet — don't block the funnel
        setNote("Verification isn't switched on yet — continuing.");
        await finishAndContinue();
        return;
      }
      const data = await r.json();
      if (!r.ok || !data.ok) {
        setErr("We couldn't send a code to that number. Check it and try again.");
        setBusy(false);
        return;
      }
      setStage("enter");
      setBusy(false);
    } catch (e) {
      setErr("Something went wrong sending the code. Please try again.");
      setBusy(false);
    }
  };

  const checkCode = async () => {
    setErr("");
    if (code.replace(/\D/g, "").length < 4) {
      setErr("Enter the code from the text message.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await r.json();
      if (data.approved) {
        await finishAndContinue();
        return;
      }
      setErr("That code wasn't right or has expired. Try again or resend.");
      setBusy(false);
    } catch (e) {
      setErr("Something went wrong checking the code. Please try again.");
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verify your phone — Swyft</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="funnel">
        <header className="f-head">
          <Brand />
          <span className="f-secure">Private &amp; no obligation</span>
        </header>
        <div className="f-progress">
          <div className="f-bar" style={{ width: "92%" }} />
        </div>

        <main className="f-main">
          <div className="f-stepno">Almost done</div>
          <h1 className="f-title">Verify your phone number</h1>

          {stage === "send" ? (
            <>
              <p className="f-sub">
                We{"\u2019"}ll text a 6-digit code to <strong>{phone}</strong> to confirm it{"\u2019"}s really you.
              </p>
              <div className="f-card">
                {err ? <p className="f-err">{err}</p> : null}
                {note ? <p className="f-sub">{note}</p> : null}
                <button className="f-btn" onClick={sendCode} disabled={busy}>
                  {busy ? "Sending\u2026" : "Text me the code"}
                </button>
                <button className="f-link" type="button" onClick={() => router.push("/step-7")}>
                  Edit my number
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="f-sub">
                Enter the 6-digit code we sent to <strong>{phone}</strong>.
              </p>
              <div className="f-card">
                <label className="f-label">Verification code</label>
                <input
                  className="f-input"
                  inputMode="numeric"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  autoFocus
                />
                {err ? <p className="f-err">{err}</p> : null}
                <button className="f-btn" onClick={checkCode} disabled={busy}>
                  {busy ? "Verifying\u2026" : "Verify & continue \u2192"}
                </button>
                <button className="f-link" type="button" onClick={sendCode} disabled={busy}>
                  Resend code
                </button>
              </div>
            </>
          )}
        </main>

        <footer className="f-foot">
          {"\u00A9"} {new Date().getFullYear()} Swyft Home Buyers {"\u00B7"} Indianapolis {"\u00B7"} Cleveland {"\u00B7"} Columbus {"\u00B7"} St. Louis
        </footer>
      </div>
    </>
  );
}
