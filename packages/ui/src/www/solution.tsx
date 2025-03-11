"use client";

import FlickeringGrid from "@allyson/ui/magicui/flickering-grid";
import Ripple from "@allyson/ui/magicui/ripple";
import Safari from "@allyson/ui/magicui/safari";
import Section from "@allyson/ui/www/section";
import { cn } from "@allyson/ui/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    title: "Advanced AI Assistant",
    description:
      "Allyson is a powerful AI executive assistant that can help you draft emails, schedule meetings, analyze data, do research, and more.",
    className: "hover:bg-red-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <Safari
          src={`/dash.png`}
          url="https://allyson.ai"
          className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
        />
      </>
    ),
  },
  {
    title: "Secure Data Handling",
    description:
      "We prioritize your data security with state-of-the-art encryption and strict privacy protocols, ensuring your information remains confidential.",
    className:
      "order-3 xl:order-none hover:bg-blue-500/10 transition-all duration-500 ease-out",
    content: (
      <Safari
        src={`/dash.png`}
        url="https://allyson.ai"
        className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
      />
    ),
  },
  {
    title: "Access Allyson Anywhere",
    description:
      "Our mobile app allows you to access Allyson from anywhere, anytime.",
    className:
      "md:row-span-2 hover:bg-orange-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <FlickeringGrid
          className="z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
          squareSize={4}
          gridGap={6}
          color="#000"
          maxOpacity={0.1}
          flickerChance={0.1}
          height={800}
          width={800}
        />
        <Safari
          src={`/dash.png`}
          url="https://allyson.ai"
          className="-mb-48 ml-12 mt-16 h-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-x-[-10px] transition-all duration-300"
        />
      </>
    ),
  },
  {
    title: "Customizable Solutions",
    description:
      "Tailor our AI services to your specific needs with flexible customization options, allowing you to get the most out of our platform.",
    className:
      "flex-row order-4 md:col-span-2 md:flex-row xl:order-none hover:bg-green-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <Ripple className="absolute -bottom-full" />
        <Safari
          src={`/dash.png`}
          url="https://allyson.ai"
          className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
        />
      </>
    ),
  },
];

export default function SolutionSection() {
  return (
    <Section
      title="Solution"
      subtitle="Empower Your Business with AI Workflows"
      description="Generic AI tools won't suffice. Our platform is purpose-built to provide exceptional AI-driven solutions for your unique business needs."
      className="bg-zinc-900"
    >
      <div className="mx-auto mt-16 grid max-w-sm grid-cols-1 gap-6 text-zinc-500 md:max-w-3xl md:grid-cols-2 xl:grid-rows-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={cn(
              "group relative items-start overflow-hidden bg-zinc-900 dark:bg-zinc-800 p-6 rounded-2xl",
              feature.className
            )}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
          >
            <div>
              <h3
                className="font-semibold mb-2 text-primary"
              >
                {feature.title}
              </h3>
              <p className="text-foreground">{feature.description}</p>
            </div>
            {feature.content}
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-zinc-900 dark:from-zinc-800 pointer-events-none"></div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
