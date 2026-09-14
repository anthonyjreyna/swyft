export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        :root {
          --ink: #17213B;
          --muted: #5B6B85;
          --line: #DEE5EF;
          --accent: #17213B;
          --gold-ink: #2277E3;
          --brand: #1F6FE0;
          --accent-deep: #111A30;
          --bg: #FFFFFF;
          --card: #ffffff;
          --good: #1F6FE0;
          --gold: #1F6FE0;
          --gold-deep: #185CBD;
          --tint: #F4F7FC;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { color-scheme: light; }
        gmp-place-autocomplete { color-scheme: light; }
        body {
          font-family: "Mulish", -apple-system, "Segoe UI", system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }

        .funnel { min-height: 100vh; display: flex; flex-direction: column; }

        /* ---- split-screen layout (step 1) ---- */
        .f-split { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); min-height: 100vh; }
        .f-split-aside { background: linear-gradient(180deg, #2277E3 0%, #1E6AD6 100%); color: #fff; padding: 0; display: block; position: sticky; top: 0; height: 100vh; overflow: hidden; }
        .f-split-main { background: #fff; }
        .aside-house { position: absolute; left: 0; bottom: 0; width: 100%; height: auto; max-height: 72%; pointer-events: none; }
        .palm-tree { position: absolute; right: 0; bottom: 0; height: 94%; width: auto; pointer-events: none; }
        .palm-gold { position: absolute; right: 0; top: 0; width: clamp(200px, 44%, 320px); height: auto; pointer-events: none; }
        @media (max-width: 900px) { .palm-tree, .palm-gold { display: none; } }
        .f-split-aside h2 { font-size: clamp(28px, 2.6vw, 40px); font-weight: 800; line-height: 1.12; letter-spacing: -0.8px; color: #fff; max-width: 15ch; }
        .f-split-aside p.lede { margin-top: 16px; font-size: 17px; font-weight: 600; line-height: 1.55; opacity: .95; max-width: 34ch; }
        .aside-list { list-style: none; margin: 30px 0 0; padding: 0; display: grid; gap: 14px; }
        .aside-list li { display: flex; align-items: flex-start; gap: 11px; font-size: 15.5px; font-weight: 600; line-height: 1.45; }
        .aside-check { width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.42); display: inline-flex; align-items: center; justify-content: center; flex: none; margin-top: 1px; }
        .aside-check svg { width: 13px; height: 13px; }
        .aside-quote { margin-top: 34px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.28); font-size: 15px; line-height: 1.6; font-style: italic; opacity: .96; }
        .aside-quote b { display: block; margin-top: 10px; font-style: normal; font-size: 13.5px; font-weight: 700; opacity: .9; }
        .aside-trust { margin-top: 26px; display: flex; flex-wrap: wrap; gap: 10px 22px; font-size: 13.5px; font-weight: 700; opacity: .95; }
        .aside-trust span { display: inline-flex; align-items: center; gap: 7px; }
        .f-split .funnel { min-height: 100vh; }

        @media (max-width: 900px) {
          .f-split { grid-template-columns: 1fr; }
          .f-split-aside { display: none; }
          .f-split-aside h2 { font-size: 25px; max-width: none; }
          .f-split-aside p.lede, .aside-quote { display: none; }
          .aside-list { margin-top: 18px; gap: 9px; }
          .aside-list li { font-size: 14.5px; }
          .aside-trust { margin-top: 18px; font-size: 12.5px; gap: 8px 16px; }
        }
        .f-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 22px; max-width: 760px; margin: 0 auto; width: 100%;
        }
        .brand { display: inline-flex; align-items: center; gap: 10px; font-family: "Mulish", -apple-system, sans-serif; font-weight: 800; font-size: 21px; letter-spacing: -0.2px; color: var(--brand); }
        .brand-mark { width: 30px; height: 30px; display: block; }
        .f-secure { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); font-weight: 700; }
        .f-secure svg { width: 13px; height: 13px; flex: none; }

        .f-progress { height: 4px; background: #E8EEF7; max-width: 760px; margin: 0 auto; width: 100%; border-radius: 999px; overflow: hidden; }
        .f-bar { height: 100%; background: linear-gradient(90deg, #2277E3, #1F6FE0); transition: width 0.4s cubic-bezier(.4,0,.2,1); }

        .f-main { flex: 1; max-width: 560px; margin: 0 auto; width: 100%; padding: 44px 22px 54px; }
        .f-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: 0; color: var(--muted); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; padding: 0; margin-top: 16px; width: 100%; justify-content: center; }
        .f-back:hover { color: var(--accent); }
        .f-stepno { font-size: 12.5px; font-weight: 800; color: var(--gold-ink); text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 14px; }
        .f-title { font-family: "Mulish", -apple-system, sans-serif; font-size: clamp(27px, 4.6vw, 37px); font-weight: 800; color: var(--accent); letter-spacing: -0.9px; line-height: 1.13; }
        .f-sub { color: var(--muted); font-size: 16.5px; font-weight: 600; margin-top: 12px; line-height: 1.55; }
        .f-card { margin-top: 28px; }

        .choices { display: grid; gap: 12px; }
        .choice {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; text-align: left; background: var(--card); color: var(--ink);
          border: 1.5px solid var(--line); border-radius: 13px; padding: 17px 19px;
          font-size: 16.5px; font-weight: 600; font-family: inherit; cursor: pointer;
          transition: border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
        }
        .choice:hover { border-color: var(--brand); background: var(--tint); transform: translateY(-1px); box-shadow: 0 12px 26px -18px rgba(23, 33, 59, 0.35); }
        .choice-arrow { color: var(--gold-ink); font-weight: 800; opacity: .7; }
        .choice.rec { border-color: var(--brand); }
        .rec-badge { display: inline-block; margin-left: 10px; background: #E4EDF8; color: #3A6BA5; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 3px 8px; border-radius: 999px; vertical-align: 2px; }

        .f-label { display: block; font-size: 13px; font-weight: 800; color: var(--ink); letter-spacing: .01em; margin: 0 0 8px; }
        .f-input {
          width: 100%; border: 1.5px solid var(--line); border-radius: 11px;
          padding: 16px 16px; font-size: 16.5px; font-weight: 600; font-family: inherit; color: var(--ink); background: #fff;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .f-input::placeholder { color: #93A0B6; font-weight: 500; }
        .f-input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 4px rgba(31,111,224,.14); }
        .addrbox { width: 100%; }
        .f-map { width: 100%; height: 168px; border-radius: 11px; overflow: hidden; border: 1px solid var(--line); margin-bottom: 14px; background: var(--tint); }
        .f-mapcap { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: var(--brand); margin: -6px 0 16px; }
        .f-mapcap svg { width: 15px; height: 15px; flex: none; }
        gmp-place-autocomplete { width: 100%; display: block; }
        .f-trust { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px; margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--line); }
        .f-trust span { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: var(--muted); }
        .f-trust svg { width: 15px; height: 15px; flex: none; color: var(--brand); }
        .f-trust .f-stars { color: #E8A400; letter-spacing: 1px; font-size: 12px; }
        .f-trust b { color: var(--ink); }
        .f-assure { display: flex; align-items: flex-start; gap: 10px; margin-top: 14px; background: var(--tint); border-radius: 11px; padding: 13px 15px; font-size: 13px; font-weight: 600; color: var(--muted); line-height: 1.5; }
        .f-assure b { display: block; color: var(--ink); font-size: 13.5px; font-weight: 800; margin-bottom: 1px; }
        .f-assure svg { width: 17px; height: 17px; flex: none; color: var(--brand); margin-top: 2px; }
        .f-agent { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; margin-bottom: 18px; font-size: 14.5px; color: var(--muted); }
        .f-agent b { color: var(--ink); }
        .f-agent-photo { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; flex: none; border: 2px solid #fff; box-shadow: 0 0 0 2px var(--line); }
        .f-agent-av { width: 44px; height: 44px; border-radius: 50%; background: var(--brand); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex: none; letter-spacing: .02em; }
        .f-consent { font-size: 12.5px; color: var(--muted); line-height: 1.55; margin-top: 16px; }
        .f-btn {
          width: 100%; margin-top: 18px; background: var(--gold); color: #fff;
          border: 0; border-radius: 11px; padding: 17px; font-size: 17px; font-weight: 800;
          box-shadow: 0 10px 22px -12px rgba(31,111,224,.75);
          font-family: inherit; cursor: pointer; transition: background 0.15s ease, transform 0.1s ease;
        }
        .f-btn:hover { background: var(--gold-deep); box-shadow: 0 14px 26px -12px rgba(31,111,224,.8); }
        .f-btn:active { transform: translateY(1px); }
        .f-btn:disabled { opacity: 0.6; cursor: default; }

        .f-foot { text-align: center; color: var(--muted); font-size: 12.5px; padding: 24px 22px 34px; }
        .f-err { color: #c0392b; font-size: 14px; margin-bottom: 12px; font-weight: 500; }
        .f-link { display: block; width: 100%; margin-top: 12px; background: none; border: 0; color: var(--accent); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .f-link:hover { text-decoration: underline; }
        .f-link:disabled { opacity: 0.5; cursor: default; }

        /* Thank-you page */
        .brand-wordmark { letter-spacing: 0.24em; font-family: "Figtree", system-ui, sans-serif; font-size: 18px; font-weight: 700; color: var(--brand); }
        .done-check { width: 58px; height: 58px; border-radius: 50%; background: var(--brand); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 18px; box-shadow: 0 0 0 6px #E4EDF8; }
        .done-map { width: 100%; height: 190px; object-fit: cover; border-radius: 12px; border: 1px solid var(--line); display: block; margin-top: 22px; }
        .done-map-cap { font-size: 13px; color: var(--muted); margin-top: 8px; text-align: center; }
        .done-card { background: #fff; border: 1px solid var(--line); border-radius: 13px; padding: 22px 24px; margin-top: 22px; }
        .done-h { font-family: "Bricolage Grotesque", Georgia, serif; font-size: 19px; color: var(--ink); margin-bottom: 10px; }
        .done-list { margin: 0; padding-left: 20px; color: var(--muted); }
        .done-list li { padding: 4px 0; }
        .done-steps { list-style: none; counter-reset: dstep; margin: 0; padding: 0; display: grid; gap: 16px; }
        .done-steps li { counter-increment: dstep; position: relative; padding-left: 40px; }
        .done-steps li::before { content: counter(dstep); position: absolute; left: 0; top: 0; width: 27px; height: 27px; border-radius: 50%; background: var(--brand); color: #fff; font-size: 13.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .done-steps b { display: block; font-size: 15px; font-weight: 800; color: var(--ink); }
        .done-steps span { display: block; font-size: 14px; color: var(--muted); line-height: 1.5; margin-top: 2px; }
        .done-tip { display: flex; align-items: flex-start; gap: 11px; margin-top: 14px; background: var(--tint); border-radius: 12px; padding: 14px 16px; }
        .done-tip svg { width: 18px; height: 18px; flex: none; color: var(--brand); margin-top: 2px; }
        .done-tip b { display: block; font-size: 14px; font-weight: 800; color: var(--ink); }
        .done-tip span { font-size: 13.5px; color: var(--muted); line-height: 1.5; }
        .done-home { display: block; text-align: center; margin-top: 26px; font-size: 14px; font-weight: 700; color: var(--muted); }
        .done-home:hover { color: var(--brand); }

        .done-call { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 14px; background: var(--gold); color: #fff; border-radius: 12px; padding: 17px; font-size: 17px; font-weight: 700; text-decoration: none; transition: background .15s ease, transform .1s ease; }
        .done-call:hover { background: var(--gold-deep); }
        .done-call:active { transform: translateY(1px); }
        .done-call svg { width: 19px; height: 19px; flex: none; }
        .done-call-note { text-align: center; font-size: 12.5px; color: var(--muted); margin-top: 8px; }

        /* Call Now + live agents — mobile only */
        .f-call { display: none; }
        @media (max-width: 640px) {
          .f-call { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 26px; }
        }
        .f-callbtn {
          display: inline-flex; align-items: center; gap: 9px; background: var(--good); color: #fff;
          font-weight: 700; font-size: 16.5px; padding: 14px 30px; border-radius: 999px;
          box-shadow: 0 10px 24px -14px rgba(0, 87, 184, 0.55);
        }
        .f-callbtn:active { transform: translateY(1px); }
        @keyframes callpulse {
          0%, 100% { box-shadow: 0 10px 24px -14px rgba(0, 87, 184, 0.55), 0 0 0 0 rgba(0, 87, 184, 0.35); }
          50% { box-shadow: 0 10px 24px -14px rgba(0, 87, 184, 0.55), 0 0 0 10px rgba(0, 87, 184, 0); }
        }
        .f-callbtn, .done-call { animation: callpulse 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .f-callbtn, .done-call, .f-dot { animation: none; } }
        .done-sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 60; background: #fff; border-top: 1px solid var(--line); padding: 10px 14px calc(10px + env(safe-area-inset-bottom)); transform: translateY(110%); transition: transform 0.3s ease; box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.08); }
        .done-sticky.show { transform: none; }
        .done-sticky .done-call { margin-top: 0; max-width: 560px; margin-left: auto; margin-right: auto; padding: 14px; }
        .f-agents { display: flex; align-items: center; gap: 11px; }
        .f-avs { display: inline-flex; }
        .f-av {
          width: 34px; height: 34px; border-radius: 50%; border: 2px solid #fff;
          display: inline-flex; align-items: center; justify-content: center;
          margin-left: -10px; box-shadow: 0 1px 3px rgba(0,0,0,0.18);
        }
        .f-av:first-child { margin-left: 0; }
        .f-agents-txt { display: inline-flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 600; color: var(--muted); }
        .f-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--good); display: inline-block; animation: fpulse 1.6s ease-in-out infinite; }
        @keyframes fpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </>
  );
}
