import { pageVars } from "@/lib/theme";
import { getFeaturedProjects, getVisibleProjects } from "@/lib/projects";
import { getEventNames } from "@/lib/events";
import JsonLd from "@/components/JsonLd";
import CursorSpotlight from "@/components/CursorSpotlight";
import FloatingChrome from "@/components/FloatingChrome";
import Hero from "@/components/Hero";
import ServicesIntro from "@/components/ServicesIntro";
import Services from "@/components/Services";
import EventsMarquee from "@/components/EventsMarquee";
import StatsBand from "@/components/StatsBand";
import FeaturedProjects from "@/components/FeaturedProjects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionCurve from "@/components/SectionCurve";

export const dynamic = "force-dynamic";

const LIGHT = "#FAFAFA";
const INK = "#0A0A0B";
const DARK = "#0F0F12";

export default async function Home() {
  const [featured, visible, events] = await Promise.all([
    getFeaturedProjects(1),
    getVisibleProjects(),
    getEventNames(),
  ]);

  return (
    <div className="w-full min-h-screen" style={{ background: "#FAFAFA", ...pageVars }}>
      <JsonLd />
      <CursorSpotlight />
      <FloatingChrome />
      <Hero featuredProject={featured[0] ?? null} projectCount={visible.length} />
      <ServicesIntro />
      <SectionCurve from={LIGHT} to={INK} />
      <Services />
      <SectionCurve from={INK} to={LIGHT} />
      <EventsMarquee events={events} />
      <SectionCurve from={LIGHT} to={LIGHT} lip={false} />
      <StatsBand />
      <SectionCurve from={LIGHT} to={DARK} />
      <FeaturedProjects />
      <SectionCurve from={DARK} to={LIGHT} />
      <About />
      <SectionCurve from={LIGHT} to={DARK} />
      <Contact />
      <Footer />
    </div>
  );
}
