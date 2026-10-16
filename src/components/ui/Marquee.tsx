export default function Marquee({ text = "FDA AWARDS 2026" }: { text?: string }) {
  return (
    <div className="relative overflow-hidden border-y border-foreground/10 py-3">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-secondary via-primary to-primary"
      />
      <div className="marquee-track">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {Array.from({ length: 6 }).map((_, j) => (
              <span key={j} className="font-display mx-6 text-lg text-primary/80 md:text-xl">
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}