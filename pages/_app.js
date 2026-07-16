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
        .f-btn {
          width: 100%; margin-top: 20px; background: var(--gold); color: #fff;
          border: 0; border-radius: 999px; padding: 16px; font-size: 16.5px; font-weight: 600;
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
