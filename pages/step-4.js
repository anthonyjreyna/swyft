import Head from "next/head";
import { FunnelLayout, Choices } from "../components/funnel";

export default function Step4() {
  return (
    <>
      <Head><title>Bathrooms — HomeOffer</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <FunnelLayout step={4} title="How many bathrooms?">
        <Choices
          name="bathrooms"
          next="/step-5"
          options={["1", "1.5", "2", "3", "4 or more"]}
        />
      </FunnelLayout>
    </>
  );
}
