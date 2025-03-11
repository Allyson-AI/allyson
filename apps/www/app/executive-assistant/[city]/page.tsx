import Pricing from "@allyson/ui/www/pricing";
import Footer from "@allyson/ui/www/footer";
import Header from "@allyson/ui/www/header";
import Immersive from "@allyson/ui/www/immersive";
import ManualTasks from "@allyson/ui/www/manual-tasks";
import Faq from "@allyson/ui/www/faq";
import { SphereMask } from "@allyson/ui/magicui/sphere-mask";
import HeroSection from "@allyson/ui/www/hero-section";
import DownloadCTA from "@allyson/ui/www/download-cta";
import Particles from "@allyson/ui/magicui/particles";
import { cities } from "@allyson/lib/us-cities"; // Adjust the path as needed
import { faqs } from "@allyson/data/faqs";
import Features from "@allyson/ui/www/features";

export default function Home({ params }) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex-col items-center justify-between px-6 pt-6 md:px-12 md:pt-12 pb-6  bg-dot-black/[0.1]">
        <HeroSection city={params.city} />
        <SphereMask />
        <Features />
        {/* <Immersive /> */}

        <DownloadCTA />
        <ManualTasks />
        <Onboard />
        <Pricing />
        <Faq faqs={faqs} />
        <Particles
          className="absolute inset-0 -z-10"
          quantity={50}
          ease={70}
          size={0.05}
          staticity={40}
          color={"#ffffff"}
        />
      </main>
      <Footer city={params.city} cities={cities} />
    </>
  );
}

// Helper function to convert city name to slug
const cityToSlug = (city) => city.toLowerCase().replace(/\s+/g, "-");

// Generate static paths for cities
export async function generateStaticParams() {
  const slugs = [];

  for (const state in cities) {
    slugs.push(cityToSlug(state));
    for (const city of cities[state]) {
      slugs.push(cityToSlug(city));
    }
  }

  return slugs.map((city) => ({ params: { city } }));
}
