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
            if (addr) selectedRef.current = addr;

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
          <span className="f-guarantee-txt"><b>Free, No-Obligation Cash Offer</b><span>The offer is yours to keep — accept it, shop it around, or just file it away.</span></span>
        </div>
      </FunnelLayout>
    </>
  );
}
