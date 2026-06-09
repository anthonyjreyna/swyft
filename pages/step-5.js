import Head from "next/head";
import { FunnelLayout, Choices } from "../components/funnel";

export default function Step5() {
  return (
    <>
      <Head><title>Condition — HomeOffer</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <FunnelLayout step={5} title="What kind of shape is it in?" subtitle="An honest estimate is fine — investors buy in any condition.">
        <Choices
          name="condition"
          next="/step-6"
          options={["Needs major work", "Needs some updates", "Good condition", "Excellent / turnkey"]}
        />
      </FunnelLayout>
    </>
  );
}
