import { cn } from "@allyson/ui/lib/utils";

const TextShimmer = ({ children, className, shimmerWidth = 100 }) => {
  return (
    <a
      href="https://app.allyson.ai"
      // target="_blank"
      style={{
        "--shimmer-width": `${shimmerWidth}px`,
      }}
      className={cn(
        "mx-auto max-w-md text-neutral-600/50 dark:text-zinc-400/70",

        // Shimmer effect
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shimmer gradient
        "bg-gradient-to-r from-neutral-100 via-black/80 via-50% to-neutral-100 dark:from-neutral-900 dark:via-white/80 dark:to-neutral-900",

        className
      )}
    >
      {children}
    </a>
  );
};

export default TextShimmer;
