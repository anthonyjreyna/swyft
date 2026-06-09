import Head from "next/head";
import { FunnelLayout, Choices } from "../components/funnel";

export default function Step6() {
  return (
    <>
      <Head><title>Timeline — HomeOffer</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <FunnelLayout step={6} title="How soon do you want to sell?">
        <Choices
          name="timeline"
          next="/step-7"
          options={["As soon as possible", "Within 1\u20133 months", "3\u20136 months", "Just exploring"]}
        />
      </FunnelLayout>
    </>
  );
}
