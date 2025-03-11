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
import { faqs } from "@allyson/data/faqs";
import Features from "@allyson/ui/www/features";
import ProblemSection from "@allyson/ui/www/problem";
import SolutionSection from "@allyson/ui/www/solution";
import HowItWorks from "@allyson/ui/www/how-it-works";
import MainFaq from "@allyson/ui/www/main-faq";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex-col items-center justify-between pt-6 md:pt-12 pb-6 bg-dot-black/[0.1]">
        <HeroSection />
        <SphereMask />
        <ProblemSection />
        <HowItWorks />
        <DownloadCTA />
        <Features />
        <Pricing />
        <MainFaq />
        <Particles
          className="absolute inset-0 -z-10"
          quantity={50}
          ease={70}
          size={0.05}
          staticity={40}
          color={"#ffffff"}
        />
      </main>
      <Footer />
    </>
  );
}
