import Head from "next/head";
import { FunnelLayout, Choices } from "../components/funnel";

export default function Step2() {
  return (
    <>
      <Head><title>Property type — HomeOffer</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <FunnelLayout step={2} title="What type of property is it?">
        <Choices
          name="propertyType"
          next="/step-3"
          options={["Single-family home", "Condo", "Townhouse", "Multi-family", "Mobile / manufactured"]}
        />
      </FunnelLayout>
    </>
  );
}
