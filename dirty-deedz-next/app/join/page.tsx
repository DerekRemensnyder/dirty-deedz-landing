"use client";

import Nav from "../../components/Nav";
import JoinHero from "../../components/join/JoinHero";
import HowItWorksJoin from "../../components/join/HowItWorksJoin";
import EarningsBreakdown from "../../components/join/EarningsBreakdown";
import OnboardingFlow from "../../components/join/OnboardingFlow";
import Footer from "../../components/Footer";

export default function JoinPage() {
  return (
    <>
      <Nav />
      <JoinHero />
      <HowItWorksJoin />
      <EarningsBreakdown />
      <OnboardingFlow />
      <Footer />
    </>
  );
}
