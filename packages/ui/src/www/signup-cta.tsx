import { BorderBeam } from "@allyson/ui/magicui/border-beam";
import Image from "next/image";
import { Button } from "@allyson/ui/button";
import ShinyButton from "@allyson/ui/magicui/shiny-button";


export default function SignUpCTA() {
  return (
    <section id="cta" className="mb-20">
      <div className="">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border p-10">
            <div className="relative mt-20 animate-fade-up opacity-0 [--animation-delay:100ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]">
              <div
                className={`relative rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-100 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom_right,var(--color-two),transparent_40%),linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] before:animate-image-glow`}
              >
                <BorderBeam
                  size={300}
                  duration={5}
                  delay={0}
                  colorFrom="#4CD3FF"
                  colorTo="#D573F6"
                  borderWidth={1}
                />

                <Image
                  src="/dash.png"
                  alt="Hero Image"
                  className="hidden relative w-full h-full p-1 rounded-[inherit] object-contain dark:block"
                  height={3000}
                  width={2000}
                  priority
                />
              </div>
            </div>
           
            <div className="z-10 -mt-20 flex flex-col items-center text-center text-black dark:text-white">
              <h1 className="text-xl font-bold lg:text-4xl">
                Ready To Hire Your Best &amp; Last Virtual Assistant?
              </h1>
              <p className="mt-2">
                Allyson will be the best make your life more productive &amp; efficient by handling the menial tasks.
              </p>
              <ShinyButton text="Get Started For Only $49/mo" className="mt-4" />
            </div>

            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-white to-90% dark:to-black" />
          </div>
        </div>
      </div>
    </section>
  );
}
