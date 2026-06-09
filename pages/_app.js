export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        :root {
          --ink: #0f1f33;
          --muted: #5b6b7d;
          --line: #e4e9f0;
          --accent: #2563eb;
          --accent-deep: #1d4ed8;
          --bg: #f5f8fc;
          --card: #ffffff;
          --good: #16a34a;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
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
        .brand { display: inline-flex; align-items: center; gap: 11px; font-weight: 800; font-size: 19px; letter-spacing: -0.01em; }
        .brand-mark {
          width: 30px; height: 30px; border-radius: 8px; background: var(--accent);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .f-secure { font-size: 12.5px; color: var(--muted); font-weight: 500; }

        .f-progress { height: 6px; background: #e7edf5; max-width: 760px; margin: 0 auto; width: calc(100% - 0px); border-radius: 999px; overflow: hidden; }
        .f-bar { height: 100%; background: var(--accent); transition: width 0.35s ease; }

        .f-main { flex: 1; max-width: 560px; margin: 0 auto; width: 100%; padding: 38px 22px 50px; }
        .f-back { display: inline-flex; align-items: center; gap: 6px; background: none; border: 0; color: var(--muted); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; padding: 0; margin-bottom: 14px; }
        .f-back:hover { color: var(--accent); }
        .f-stepno { font-size: 13px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
        .f-title { font-size: clamp(26px, 5vw, 36px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.12; }
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
        .choice:hover { border-color: var(--accent); transform: translateY(-1px); box-shadow: 0 10px 24px -16px rgba(37, 99, 235, 0.6); }
        .choice-arrow { color: var(--accent); font-weight: 700; }

        .f-label { display: block; font-size: 13.5px; font-weight: 700; color: var(--ink); margin: 14px 0 7px; }
        .f-input {
          width: 100%; border: 1.5px solid var(--line); border-radius: 12px;
          padding: 14px 16px; font-size: 16px; font-family: inherit; color: var(--ink); background: #fff;
        }
        .f-input:focus { outline: none; border-color: var(--accent); }
        .addrbox { width: 100%; }
        .f-map { width: 100%; height: 230px; border-radius: 12px; overflow: hidden; border: 1px solid var(--line); margin-bottom: 16px; background: #eef2f6; }
        gmp-place-autocomplete { width: 100%; display: block; }
        .f-btn {
          width: 100%; margin-top: 20px; background: var(--accent); color: #fff;
          border: 0; border-radius: 12px; padding: 16px; font-size: 16.5px; font-weight: 700;
          font-family: inherit; cursor: pointer; transition: background 0.15s ease, transform 0.1s ease;
        }
        .f-btn:hover { background: var(--accent-deep); }
        .f-btn:active { transform: translateY(1px); }
        .f-btn:disabled { opacity: 0.6; cursor: default; }

        .f-foot { text-align: center; color: var(--muted); font-size: 12.5px; padding: 24px 22px 34px; }
        .f-err { color: #c0392b; font-size: 14px; margin-bottom: 12px; font-weight: 500; }
        .f-link { display: block; width: 100%; margin-top: 12px; background: none; border: 0; color: var(--accent); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .f-link:hover { text-decoration: underline; }
        .f-link:disabled { opacity: 0.5; cursor: default; }
      `}</style>
    </>
  );
}
