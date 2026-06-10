import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { FunnelLayout, getAnswers, setAnswer } from "../components/funnel";

export default function Step7() {
  const [f, setF] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.phone.trim()) return;
    setBusy(true);
    setAnswer("name", f.name.trim());
    setAnswer("email", f.email.trim());
    setAnswer("phone", f.phone.trim());
    router.push("/verify");
  };

  return (
    <>
      <Head><title>Your cash offer — Swyft</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <FunnelLayout
        step={7}
        title="Where should we send your cash offer?"
        subtitle="Your information is private and there is no obligation."
      >
        <form onSubmit={submit}>
          <label className="f-label">Full name</label>
          <input className="f-input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" />
          <label className="f-label">Email</label>
          <input className="f-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@email.com" />
          <label className="f-label">Phone</label>
          <input className="f-input" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-5555" />
          <button className="f-btn" type="submit" disabled={busy}>
            {busy ? "\u2026" : "Continue \u2192"}
          </button>
        </form>
      </FunnelLayout>
    </>
  );
}
