import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FunnelLayout, setAnswer } from "../components/funnel";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function loadMaps(key) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.google && window.google.maps) return resolve();
    const existing = document.getElementById("gmaps-js");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("load error")));
      return;
    }
    const s = document.createElement("script");
    s.id = "gmaps-js";
    s.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      encodeURIComponent(key) +
      "&libraries=places&loading=async&v=weekly";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("load error"));
    document.head.appendChild(s);
  });
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
      loadMaps(KEY)
        .then(async () => {
          if (cancelled) return;
          const g = window.google;

          try {
            if (g.maps.importLibrary) await g.maps.importLibrary("maps");
          } catch (e) {}

          if (mapRef.current) {
            mapObj.current = new g.maps.Map(mapRef.current, {
              center: { lat: 39.5, lng: -98.35 },
              zoom: 4,
              mapTypeId: "roadmap",
              disableDefaultUI: true,
              gestureHandling: "cooperative",
            });
            mapRef.current.style.display = "block";
          }

          let places = null;
          try {
            if (g.maps.importLibrary) places = await g.maps.importLibrary("places");
          } catch (e) {}
          if (!places) places = g.maps.places;
          const PAC =
            (places && places.PlaceAutocompleteElement) ||
            (g.maps.places && g.maps.places.PlaceAutocompleteElement);
          if (!PAC) return;

          const pac = new PAC();
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
        })
        .catch(() => {});
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
