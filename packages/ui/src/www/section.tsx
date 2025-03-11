export default function Section({
  id,
  title,
  subtitle,
  description,
  children,
  className,
}) {
  const sectionId = title ? title.toLowerCase().replace(/\s+/g, "-") : id;
  return (
    <section id={id || sectionId}>
      <div className={className}>
        <div className="relative container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center space-y-4 pb-6 mx-auto">
            {title && (
              <h2
                className="text-sm text-primary font-medium tracking-wider uppercase"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <h3
                style={{ fontFamily: "'ClashDisplay', sans-serif" }}
                className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl bg-clip-text text-transparent leading-none bg-gradient-to-r from-[#fff] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.3)]"
              >
                {subtitle}
              </h3>
            )}
            {description && (
              <p className="mt-6 text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
