import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FunnelLayout, setAnswer } from "../components/funnel";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Official-style Google Maps loader: defines google.maps.importLibrary, which
// resolves only once the API is genuinely ready. This avoids the "works only
// after refresh" race caused by using a plain script onload.
function bootstrapMaps(key) {
  const w = window;
  w.google = w.google || {};
  const maps = (w.google.maps = w.google.maps || {});
  if (maps.importLibrary) return; // already set up
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
            if (loc && mapObj.current) {
              mapObj.current.setMapTypeId("hybrid");
              mapObj.current.panTo(loc);
              mapObj.current.setZoom(19);
              if (!markerObj.current) {
                markerObj.current = new g.maps.Marker({ map: mapObj.current, position: loc });
              } else {
                markerObj.current.setPosition(loc);
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
      </FunnelLayout>
    </>
  );
}
