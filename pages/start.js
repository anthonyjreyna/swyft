import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FunnelLayout, setAnswer } from "../components/funnel";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function bootstrapMaps(key) {
  const w = window;
  w.google = w.google || {};
  const maps = (w.google.maps = w.google.maps || {});
  if (maps.importLibrary) return;
  const libs = new Set();
  let loadPromise = null;
  const load = () => {
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      params.set("key", key);
      params.set("v", "weekly");
      params.set("libraries", [...libs].join(","));
      params.set("callback", "google.maps.__ib__");
      maps.__ib__ = resolve;
      const s = document.createElement("script");
      s.src = "https://maps.googleapis.com/maps/api/js?" + params.toString();
      s.async = true;
      s.onerror = () => reject(new Error("Google Maps could not load."));
      document.head.appendChild(s);
    });
    return loadPromise;
  };
  maps.importLibrary = (name) => {
    libs.add(name);
    return load().then(() => maps.importLibrary(name));
  };
}

function AsideHouse() {
  return (
    <svg className="aside-house" viewBox="0 0 1100 700" preserveAspectRatio="xMinYMax slice" aria-hidden="true">
      {/* soft bushes behind the house */}
      <ellipse cx="1010" cy="470" rx="150" ry="120" fill="#7FA05B" />
      <ellipse cx="1045" cy="590" rx="170" ry="130" fill="#8FB16A" />
      <ellipse cx="905" cy="620" rx="120" ry="95" fill="#6E9450" />
      <g transform="translate(-779 -601) scale(1.7)">
        {/* house */}
        <rect x="392" y="568" width="383" height="162" fill="#F6F1E6" />
        <rect x="775" y="630" width="240" height="100" fill="#E9714B" />
        <rect x="775" y="592" width="240" height="38" fill="#26324F" />
        <rect x="786" y="597" width="44" height="28" rx="3" fill="#8FC1EC" />
        <rect x="842" y="597" width="44" height="28" rx="3" fill="#8FC1EC" />
        <rect x="898" y="597" width="44" height="28" rx="3" fill="#8FC1EC" />
        <rect x="954" y="597" width="44" height="28" rx="3" fill="#8FC1EC" />
        <rect x="414" y="600" width="190" height="108" rx="4" fill="#26324F" />
        <rect x="422" y="608" width="174" height="92" fill="#C4E4F6" />
        <rect x="422" y="608" width="174" height="40" fill="#E0F2FC" />
        <rect x="505" y="608" width="6" height="92" fill="#26324F" />
        <rect x="692" y="628" width="58" height="102" rx="3" fill="#F2B23F" />
        <circle cx="740" cy="682" r="4" fill="#26324F" />
        <rect x="806" y="652" width="180" height="78" rx="4" fill="#F08A5F" />
        <line x1="812" y1="674" x2="980" y2="674" stroke="#D9623C" strokeWidth="4" />
        <line x1="812" y1="694" x2="980" y2="694" stroke="#D9623C" strokeWidth="4" />
        <line x1="812" y1="714" x2="980" y2="714" stroke="#D9623C" strokeWidth="4" />
        <rect x="880" y="700" width="32" height="6" rx="3" fill="#26324F" />
        <polygon points="346,556 1064,590 1064,598 346,564" fill="#26324F" />
        <polygon points="346,540 1064,574 1064,590 346,556" fill="#F9F6EE" />
        {/* head-on SUV, nudged toward centre, cropped by the bottom */}
        <g transform="translate(-160 0)">
          <rect x="1094" y="834" width="34" height="40" rx="9" fill="#1D2433" />
          <rect x="1242" y="834" width="34" height="40" rx="9" fill="#1D2433" />
          <rect x="1112" y="724" width="146" height="64" rx="14" fill="#AEB6C2" />
          <rect x="1122" y="720" width="126" height="9" rx="4.5" fill="#8F98A6" />
          <path d="M1124 740 L1246 740 L1240 778 L1130 778 Z" fill="#1E2C44" />
          <path d="M1150 740 L1188 778 L1170 778 L1136 740 Z" fill="#7FA6D6" opacity=".4" />
          <rect x="1090" y="752" width="22" height="14" rx="5" fill="#9AA3B0" />
          <rect x="1258" y="752" width="22" height="14" rx="5" fill="#9AA3B0" />
          <path d="M1100 852 L1098 800 C1098 786 1106 778 1118 776 L1252 776 C1264 778 1272 786 1272 800 L1270 852 Z" fill="#B9C1CC" />
          <rect x="1148" y="800" width="74" height="22" rx="6" fill="#2A3546" />
          <rect x="1112" y="800" width="30" height="17" rx="5" fill="#F8E9B0" stroke="#D9C070" strokeWidth="1.6" />
          <rect x="1228" y="800" width="30" height="17" rx="5" fill="#F8E9B0" stroke="#D9C070" strokeWidth="1.6" />
          <rect x="1094" y="832" width="182" height="22" rx="10" fill="#7F8896" />
        </g>
      </g>
      {/* woman by the garage */}
      <g>
        <circle cx="585" cy="556" r="13" fill="#3A2E28" />
        <path d="M572 572 L598 572 L606 662 L564 662 Z" fill="#F5F3EE" />
        <path d="M596 590 C 606 598, 610 606, 608 616" stroke="#E9C9A8" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="611" cy="626" rx="12" ry="15" fill="#2F6B5E" />
      </g>
      {/* white fence peek, bottom right */}
      <g fill="#fff">
        <rect x="880" y="612" width="16" height="60" rx="3" /><polygon points="880,616 888,606 896,616" />
        <rect x="908" y="612" width="16" height="60" rx="3" /><polygon points="908,616 916,606 924,616" />
        <rect x="936" y="612" width="16" height="60" rx="3" /><polygon points="936,616 944,606 952,616" />
        <rect x="964" y="612" width="16" height="60" rx="3" /><polygon points="964,616 972,606 980,616" />
        <rect x="872" y="628" width="118" height="8" rx="4" fill="#EDF0F4" />
      </g>
      {/* left corner bush */}
      <ellipse cx="30" cy="690" rx="150" ry="92" fill="#57B56F" />
      <ellipse cx="110" cy="704" rx="120" ry="70" fill="#3FA05A" />
    </svg>
  );
}

function EdgePalm() {
  const frond = "M0 0 C 62 -30, 152 -36, 200 -10 C 150 14, 66 16, 0 0 Z";
  const green = ["#2F8A4C", "#3FA05A", "#57B56F", "#2E7B44", "#4AAB63", "#3FA05A", "#2F8A4C", "#57B56F", "#3E9E5C"];
  const gold = ["#C2A93A", "#B09627", "#D4BC55", "#A98F24"];
  return (
    <>
      {/* tall palm pinned to the bottom-right edge; right fronds clip on the divider */}
      <svg className="palm-tree" viewBox="0 0 320 900" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
        <path d="M262 950 C 252 760, 240 600, 218 430" stroke="#7B6B5E" strokeWidth="26" strokeLinecap="round" fill="none" />
        <path d="M256 950 C 247 770, 236 610, 216 442" stroke="#93826F" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".65" />
        <path d="M268 950 C 259 780, 248 620, 224 452" stroke="#5F5348" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".5" />
        <g transform="translate(218 430)">
          {[-200, -170, -140, -110, -80, -50, -15, 15, 48].map((r, i) => (
            <path key={r} d={frond} fill={green[i]} transform={"rotate(" + r + ") scale(.82)"} />
          ))}
          <circle r="12" fill="#2F8A4C" />
        </g>
      </svg>
      {/* golden fronds hanging in from the top edge */}
      <svg className="palm-gold" viewBox="0 0 300 250" preserveAspectRatio="xMaxYMin meet" aria-hidden="true">
        <g transform="translate(304 -26)">
          {[92, 122, 148, 172].map((r, i) => (
            <path key={r} d={frond} fill={gold[i]} transform={"rotate(" + r + ") scale(1.05)"} />
          ))}
          <circle r="11" fill="#B09627" />
        </g>
      </svg>
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const selectedRef = useRef("");
  const mapObj = useRef(null);
  const markerObj = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    box.innerHTML = "";
    const fallback = document.createElement("input");
    fallback.className = "f-input";
    fallback.placeholder = "123 Main St, City, State";
    fallback.setAttribute("autocomplete", "off");
    box.appendChild(fallback);

    let cancelled = false;
    if (KEY) {
      (async () => {
        try {
          bootstrapMaps(KEY);
          const g = window.google;

          const { Map } = await g.maps.importLibrary("maps");
          if (cancelled || !mapRef.current) return;

          mapRef.current.style.display = "block";
          mapObj.current = new Map(mapRef.current, {
            center: { lat: 39.5, lng: -98.35 },
            zoom: 4,
            mapTypeId: "roadmap",
            disableDefaultUI: true,
            gestureHandling: "cooperative",
          });
          setTimeout(() => {
            if (cancelled || !mapObj.current) return;
            g.maps.event.trigger(mapObj.current, "resize");
            mapObj.current.setCenter({ lat: 39.5, lng: -98.35 });
          }, 250);

          const { PlaceAutocompleteElement } = await g.maps.importLibrary("places");
          if (cancelled) return;

          const pac = new PlaceAutocompleteElement();
          pac.style.width = "100%";
          box.innerHTML = "";
          box.appendChild(pac);

          const onSelect = async (ev) => {
            let place =
              ev.place ||
              (ev.placePrediction &&
                ev.placePrediction.toPlace &&
                ev.placePrediction.toPlace());
            if (!place) return;
            try {
              await place.fetchFields({ fields: ["formattedAddress", "location"] });
            } catch (e) {}
            const addr = place.formattedAddress || "";
            if (addr) {
              selectedRef.current = addr;
              lookupRecords(addr);
            }

            const loc = place.location;
            let lat = null;
            let lng = null;
            if (loc) {
              lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
              lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
            }
            if (lat != null && lng != null) {
              setAnswer("lat", lat);
              setAnswer("lng", lng);
              if (mapObj.current) {
                mapObj.current.setMapTypeId("hybrid");
                mapObj.current.panTo({ lat, lng });
                mapObj.current.setZoom(19);
                if (!markerObj.current) {
                  markerObj.current = new g.maps.Marker({ map: mapObj.current, position: { lat, lng } });
                } else {
                  markerObj.current.setPosition({ lat, lng });
                }
              }
            }
          };
          pac.addEventListener("gmp-select", onSelect);
          pac.addEventListener("gmp-placeselect", onSelect);
        } catch (err) {
          console.warn("[funnel] Google Maps failed to initialize:", err);
        }
      })();
    }

    return () => {
      cancelled = true;
    };
  }, [router]);

  const lookupRecords = (addr) => {
    try {
      fetch("/api/property-lookup?address=" + encodeURIComponent(addr))
        .then((r) => (r.ok && r.status === 200 ? r.json() : null))
        .then((d) => {
          if (!d) return;
          const typeMap = {
            "Single Family": "Single-family home",
            "Condo": "Condo",
            "Townhouse": "Townhouse",
            "Multi-Family": "Multi-family",
            "Manufactured": "Mobile / manufactured",
            "Mobile Home": "Mobile / manufactured",
          };
          if (d.propertyType && typeMap[d.propertyType]) setAnswer("rec_propertyType", typeMap[d.propertyType]);
          if (d.bedrooms != null) setAnswer("rec_bedrooms", d.bedrooms >= 5 ? "5 or more" : String(d.bedrooms));
          if (d.bathrooms != null) {
            const b = d.bathrooms;
            setAnswer("rec_bathrooms", b >= 4 ? "4 or more" : b === 1.5 ? "1.5" : String(Math.floor(b) === b ? b : Math.round(b)));
          }
          if (d.squareFootage != null) setAnswer("squareFootage", d.squareFootage);
          if (d.yearBuilt != null) setAnswer("yearBuilt", d.yearBuilt);
          if (d.lotSize != null) setAnswer("lotSize", d.lotSize);
        })
        .catch(() => {});
    } catch (e) {}
  };

  const proceed = (e) => {
    if (e) e.preventDefault();
    let addr = selectedRef.current;
    if (!addr && boxRef.current) {
      const inp = boxRef.current.querySelector("input");
      addr = inp ? inp.value.trim() : "";
    }
    if (!addr) return;
    setAnswer("address", addr);
    router.push("/step-2");
  };

  return (
    <>
      <Head>
        <title>What Will an Investor Pay for Your House?</title>
        <meta name="description" content="Answer a few quick questions for a no-obligation cash offer range." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <FunnelLayout
        step={1}
        title="What is the address of the property you want to sell?"
        subtitle="Start typing and choose your address from the list."
        aside={<><AsideHouse /><EdgePalm /></>}
      >
        <div ref={mapRef} className="f-map" style={{ display: "none" }} />
        <form onSubmit={proceed}>
          <label className="f-label">Property address</label>
          <div ref={boxRef} className="addrbox" />
          <button className="f-btn" type="submit">Next {"\u2192"}</button>
        </form>
        <div className="f-proof" aria-label="Why homeowners trust Swyft">
          <div className="f-chip">
            <span className="f-chip-ico star" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L21.5 9.27l-4.75 4.36L18 20.5 12 17l-6 3.5 1.25-6.87L2.5 9.27l6.6-1.01z"/></svg></span>
            <span className="f-chip-txt"><b>4.9 <span className="f-stars">{"\u2605\u2605\u2605\u2605\u2605"}</span></b><span>Google reviews</span></span>
          </div>
          <div className="f-chip">
            <span className="f-chip-ico shield" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></span>
            <span className="f-chip-txt"><b>BBB Accredited</b><span>A+ rated business</span></span>
          </div>
          <div className="f-chip">
            <span className="f-chip-ico home" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-8 9 8"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/></svg></span>
            <span className="f-chip-txt"><b>300+ homes</b><span>bought in our markets</span></span>
          </div>
        </div>
        <div className="f-guarantee">
          <span className="f-guarantee-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" transform="translate(0 2)"/><path d="M9 11l2 2 4-4" transform="translate(0 2)"/></svg></span>
          <span className="f-guarantee-txt"><b>Free, No-Obligation Cash Offer</b><span>The offer is yours to keep {"\u2014"} accept it, shop it around, or just file it away.</span></span>
        </div>
      </FunnelLayout>
    </>
  );
}
