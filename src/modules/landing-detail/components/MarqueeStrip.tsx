import Image from "next/image";

const LOGOS = [
  { src: "/particle.png", alt: "Particle Network" },
  { src: "/magic.png", alt: "Magic" },
];

const REPEAT = 6;

export default function MarqueeStrip() {
  const track = Array.from({ length: REPEAT }, () => LOGOS).flat();

  return (
    <section
      aria-label="Supported by"
      className="overflow-hidden bg-[#E6E1F0] pt-10 pb-12"
    >
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0A0A0A]">
        Supported By
      </p>

      <style>{`
        @keyframes oni-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .oni-marquee-track {
          animation: oni-marquee 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .oni-marquee-track { animation: none; }
        }
      `}</style>

      <div className="relative mt-8 flex w-full">
        <div className="oni-marquee-track flex w-max shrink-0 items-center gap-16 pr-16 md:gap-20 md:pr-20">
          {[...track, ...track].map((logo, idx) => (
            <Image
              key={idx}
              src={logo.src}
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              className="h-10 w-auto shrink-0 object-contain brightness-0 md:h-12"
              priority={idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
