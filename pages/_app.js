export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        :root {
          --ink: #191C20;
          --muted: #5B5E63;
          --line: #E6E2D8;
          --accent: #191C20;
          --gold-ink: #3A6BA5;
          --brand: #0057B8;
          --accent-deep: #101215;
          --bg: #FBFAF6;
          --card: #ffffff;
          --good: #0057B8;
          --gold: #0057B8;
          --gold-deep: #00479A;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: "Figtree", system-ui, -apple-system, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }

        .funnel { min-height: 100vh; display: flex; flex-direction: column; }
        .f-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 22px; max-width: 760px; margin: 0 auto; width: 100%;
        }
        .brand { display: inline-flex; align-items: center; gap: 10px; font-family: "Bricolage Grotesque", Georgia, serif; font-weight: 700; font-size: 21px; letter-spacing: -0.01em; color: var(--brand); }
        .brand-mark { width: 30px; height: 30px; display: block; }
        .f-secure { font-size: 12.5px; color: var(--muted); font-weight: 500; }

        .f-progress { height: 6px; background: #EEEBE2; max-width: 760px; margin: 0 auto; width: calc(100% - 0px); border-radius: 999px; overflow: hidden; }
        .f-bar { height: 100%; background: #6FA3DC; transition: width 0.35s ease; }

        .f-main { flex: 1; max-width: 560px; margin: 0 auto; width: 100%; padding: 38px 22px 50px; }
        .f-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: 0; color: var(--muted); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; padding: 0; margin-top: 16px; width: 100%; justify-content: center; }
        .f-back:hover { color: var(--accent); }
        .f-stepno { font-size: 13px; font-weight: 600; color: var(--gold-ink); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
        .f-title { font-family: "Bricolage Grotesque", Georgia, serif; font-size: clamp(26px, 5vw, 36px); font-weight: 700; color: var(--accent); letter-spacing: -0.02em; line-height: 1.12; }
        .f-sub { color: var(--muted); font-size: 17px; margin-top: 12px; }
        .f-card { margin-top: 26px; }

        .choices { display: grid; gap: 12px; }
        .choice {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; text-align: left; background: var(--card); color: var(--ink);
          border: 1.5px solid var(--line); border-radius: 13px; padding: 17px 19px;
          font-size: 16.5px; font-weight: 600; font-family: inherit; cursor: pointer;
          transition: border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
        }
        .choice:hover { border-color: var(--accent); transform: translateY(-1px); box-shadow: 0 10px 24px -16px rgba(23, 25, 29, 0.12); }
        .choice-arrow { color: var(--gold-ink); font-weight: 700; }

        .f-label { display: block; font-size: 13.5px; font-weight: 700; color: var(--ink); margin: 14px 0 7px; }
        .f-input {
          width: 100%; border: 1.5px solid var(--line); border-radius: 12px;
          padding: 14px 16px; font-size: 16px; font-family: inherit; color: var(--ink); background: #fff;
        }
        .f-input:focus { outline: none; border-color: var(--accent); }
        .addrbox { width: 100%; }
        .f-map { width: 100%; height: 230px; border-radius: 12px; overflow: hidden; border: 1px solid var(--line); margin-bottom: 16px; background: #F0EDE5; }
        gmp-place-autocomplete { width: 100%; display: block; }
        .f-proof { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 24px; }
        @media (max-width: 480px) { .f-proof { grid-template-columns: 1fr; } }
        .f-chip { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 11px 12px; box-shadow: 0 6px 16px -12px rgba(23,25,29,.18); }
        .f-chip-ico { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex: none; }
        .f-chip-ico svg { width: 18px; height: 18px; }
        .f-chip-ico.star { background: #FFF3D6; color: #D89000; }
        .f-chip-ico.shield { background: #E4EDF8; color: #0057B8; }
        .f-chip-ico.home { background: #EFEBE0; color: #1A1D21; }
        .f-chip-txt { line-height: 1.25; }
        .f-chip-txt b { display: block; font-size: 13.5px; color: var(--ink); letter-spacing: .01em; }
        .f-chip-txt span { font-size: 11.5px; color: var(--muted); font-weight: 500; }
        .f-stars { color: #E8A400; font-size: 12px; letter-spacing: 1px; }
        .f-guarantee { display: flex; align-items: center; gap: 12px; margin-top: 12px; background: linear-gradient(135deg, #E4EDF8 0%, #F1F6FC 100%); border: 1px solid rgba(0,87,184,.22); border-radius: 12px; padding: 12px 16px; }
        .f-guarantee-ico { width: 38px; height: 38px; border-radius: 50%; background: #0057B8; color: #fff; display: inline-flex; align-items: center; justify-content: center; flex: none; box-shadow: 0 0 0 4px rgba(0,87,184,.14); }
        .f-guarantee-ico svg { width: 19px; height: 19px; }
        .f-guarantee-txt { line-height: 1.35; }
        .f-guarantee-txt b { display: block; font-size: 14px; color: var(--ink); }
        .f-guarantee-txt span { font-size: 12.5px; color: var(--muted); }
        .f-agent { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; margin-bottom: 18px; font-size: 14.5px; color: var(--muted); }
        .f-agent b { color: var(--ink); }
        .f-agent-av { width: 44px; height: 44px; border-radius: 50%; background: var(--brand); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex: none; letter-spacing: .02em; }
        .f-consent { font-size: 12.5px; color: var(--muted); line-height: 1.55; margin-top: 16px; }
        .f-btn {
          width: 100%; margin-top: 20px; background: var(--gold); color: #fff;
          border: 0; border-radius: 12px; padding: 16px; font-size: 16.5px; font-weight: 600;
          font-family: inherit; cursor: pointer; transition: background 0.15s ease, transform 0.1s ease;
        }
        .f-btn:hover { background: var(--gold-deep); }
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
