import Head from "next/head";
import { FunnelLayout, Choices } from "../components/funnel";

export default function Step3() {
  return (
    <>
      <Head><title>Bedrooms — HomeOffer</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <FunnelLayout step={3} title="How many bedrooms?">
        <Choices
          name="bedrooms"
          next="/step-4"
          options={["1", "2", "3", "4", "5 or more"]}
        />
      </FunnelLayout>
    </>
  );
}
