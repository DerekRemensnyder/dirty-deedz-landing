import ScrollProgress from "../components/ScrollProgress";
import RevealObserver from "../components/RevealObserver";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import ScrollTell from "../components/ScrollTell";
import MapFeature from "../components/MapFeature";
import AdGuidelines from "../components/AdGuidelines";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <RevealObserver />
      <Nav />
      <Hero />
      <About />
      <HowItWorks />
      <ScrollTell />
      <MapFeature />
      <AdGuidelines />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
