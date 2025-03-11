import Features from "@allyson/ui/magicui/features-vertical";
import Section from "@allyson/ui/www/section";
import { IconBolt, IconSparkles, IconUpload } from "@tabler/icons-react";
import Image from "next/image";

const data = [
  {
    id: 1,
    title: "1. Connect Your Inbox & Calendar",
    content:
      "We connect to your email and calendar so we can give access to Allyson to manage your calendar and inbox in the background.",
    image: "/connect-inbox.png",
    icon: <IconUpload className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: "2. Customize Your Settings",
    content:
      "You can customize your settings to fit your needs. Allyson will manage your inbox in the background categorizing emails and drafting emails.",
    image: "/settings.png",
    icon: <IconBolt className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: "3. Use Allyson",
    content:
      "Allyson will work in the background and you can chat with her anytime to write an email, schedule a meeting, search the internet or analyze a document.",
    image: "/email-draft.png",
    icon: <IconSparkles className="w-6 h-6 text-primary" />,
  },
];

export default function HowItWorks() {
  return (
    <Section 
      title="How it works" 
      subtitle="Just 3 steps to get started"
      titleClassName="bg-clip-text text-transparent leading-none bg-gradient-to-r from-[#fff] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.3)]"
    >
      <Features 
        data={data} 
        imageProps={{
          className: "object-cover w-full h-full rounded-lg"
        }}
      />
    </Section>
  );
}
