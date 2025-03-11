import { buttonVariants } from "@allyson/ui/button";
import { cn } from "@allyson/ui/lib/utils";
import Marquee from "@allyson/ui/magicui/marquee";
import { ChevronRight, HeartHandshake } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";

const reviews = [
  {
    name: "Lee H.",
    body: "I've never been more productive. Allyson saves me at least 15 hours per month.",
  },
  {
    name: "Jill",
    body: "My email runs by itself now. All I have to do is approve the drafts. My new favorite AI tool.",
  },
  {
    name: "John",
    body: "An actual AI tool that works for you. Allyson is awesome. For only $99/mo, it's such a good deal.",
  },
  {
    name: "Jane",
    body: "Allyson is what I've been missing in my life. She keeps everything on track without me lifting a finger.",
  },
  {
    name: "Carlos M.",
    body: "Allyson es increíble. Ahora tengo más tiempo para concentrarme en las cosas importantes.",
  },
  {
    name: "Priya K.",
    body: "I was skeptical at first, but Allyson has truly changed how I manage my time. Highly recommend!",
  },
  {
    name: "Megan",
    body: "Honestly, can't imagine going back to the old way of handling emails. Allyson is a game-changer.",
  },
  {
    name: "Dave",
    body: "A solid 5 stars. Allyson is intuitive and saves me so much hassle. Worth every penny.",
  },
  {
    name: "Fatima",
    body: "With Allyson, my calendar is always up-to-date. No more missed meetings or double bookings!",
  },
  {
    name: "Aiko Y.",
    body: "アリソンのおかげで仕事が楽になりました。非常に満足しています。",
  },
  {
    name: "Liam O.",
    body: "Mate, Allyson is brilliant. My productivity has gone through the roof. Totally worth it.",
  },
  {
    name: "Sofia R.",
    body: "Finalmente, un asistente de IA que realmente ayuda. No podría estar más feliz.",
  },
  {
    name: "Olivia P.",
    body: "Allyson has transformed my daily routine. I don't know how I managed without her before.",
  },
  {
    name: "Ethan W.",
    body: "The best AI assistant out there. Allyson keeps me organized and on top of my tasks effortlessly.",
  },
  {
    name: "Amara S.",
    body: "Allyson, you rock! My inbox is finally under control. So worth the investment.",
  },
  {
    name: "Luca B.",
    body: "Allyson keeps my calendar and email in check. I can focus on more important things now.",
  },
  {
    name: "Marie T.",
    body: "Je ne peux plus me passer d'Allyson. Elle simplifie tellement ma vie professionnelle.",
  },
  {
    name: "Chen L.",
    body: "Allyson has been a huge help in managing my work and personal schedules. Highly efficient!",
  },
  {
    name: "Tariq A.",
    body: "This AI assistant is incredible. Allyson saves me time and reduces my stress levels significantly.",
  },
  {
    name: "Sophia G.",
    body: "Allyson is a lifesaver! She organizes everything and makes my life so much easier.",
  },
  {
    name: "Mateo R.",
    body: "Nunca pensé que una IA podría ser tan útil. Allyson hace que todo sea más fácil.",
  },
  {
    name: "Yara K.",
    body: "With Allyson, I can handle my busy schedule without feeling overwhelmed. She's fantastic!",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-[2rem] border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.01] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <div className="flex flex-row py-1">
            <StarFilledIcon className="size-4 text-yellow-500" />
            <StarFilledIcon className="size-4 text-yellow-500" />
            <StarFilledIcon className="size-4 text-yellow-500" />
            <StarFilledIcon className="size-4 text-yellow-500" />
            <StarFilledIcon className="size-4 text-yellow-500" />
          </div>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function DownloadCTA() {
  return (
    <section id="cta" className="">
      <div className="py-14">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border p-10 py-14">
            <div className="absolute rotate-[35deg]">
              <Marquee pauseOnHover className="[--duration:60s]" repeat={3}>
                {firstRow.map((review, index) => (
                  <ReviewCard key={`first-${review.name}-${index}`} {...review} />
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                className="[--duration:60s]"
                repeat={3}
              >
                {secondRow.map((review, index) => (
                  <ReviewCard key={`second-${review.name}-${index}`} {...review} />
                ))}
              </Marquee>
              <Marquee pauseOnHover className="[--duration:60s]" repeat={3}>
                {firstRow.map((review, index) => (
                  <ReviewCard key={`first-${review.name}-${index}`} {...review} />
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                className="[--duration:60s]"
                repeat={3}
              >
                {secondRow.map((review, index) => (
                  <ReviewCard key={`second-${review.name}-${index}`} {...review} />
                ))}
              </Marquee>
              <Marquee pauseOnHover className="[--duration:60s]" repeat={3}>
                {firstRow.map((review, index) => (
                  <ReviewCard key={`first-${review.name}-${index}`} {...review} />
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                className="[--duration:60s]"
                repeat={3}
              >
                {secondRow.map((review, index) => (
                  <ReviewCard key={`second-${review.name}-${index}`} {...review} />
                ))}
              </Marquee>
            </div>
            <img
              className="p-3 z-10 mx-auto size-32 rounded-[2rem] "
              src="/allyson-app-logo.png"
              alt="Allyson App Logo"
            />
            <div className="z-10 mt-4 flex flex-col items-center text-center text-black dark:text-white">
              <h1 className="text-xl font-bold lg:text-4xl">
                Effortless Organization at Your Fingertips
              </h1>
              <p className="mt-2">
                Download Allyson on the App Store today.
              </p>
              <div className="flex flex-col md:flex-row items-center gap-3 mt-8 md:mt-3">
                <a href="https://apps.apple.com/app/allyson/id6593659141" target="_blank">
                  <img
                    className="cursor-pointer rounded-md h-[3.5rem] w-[10rem]"
                    src="/app-store.png"
                    alt="Download Allyson on the App Store"
                  />
                </a>
                {/* <a href="/" target="_blank">
                  <img
                    className="cursor-pointer rounded-md  h-[5rem] w-[12rem]"
                    src="/play-store.png"
                    alt="Download Allyson on the Play Store"
                  />
                </a> */}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-white to-70% dark:to-black" />
          </div>
        </div>
      </div>
    </section>
  );
}
