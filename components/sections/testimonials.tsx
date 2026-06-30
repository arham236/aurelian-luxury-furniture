import Image from "next/image";
import { Star } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import { testimonials } from "@/data/products";

export default function Testimonials() {
  return (
    <section className="bg-surface-container-low px-margin-mobile py-24 md:px-margin-desktop md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-4 block text-label-caps text-secondary">
            In Their Words
          </span>
          <h2 className="text-headline-lg text-primary">
            Trusted by Discerning Homes
          </h2>
        </Reveal>

        <Reveal
          as="div"
          stagger
          className="grid grid-cols-1 gap-gutter md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col justify-between rounded-[24px] border border-white/20 bg-surface-container-lowest p-8 shadow-level-2 transition-shadow duration-300 hover:shadow-level-3"
            >
              <div>
                <div className="mb-4 flex gap-1 text-secondary">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mb-8 text-body-md text-on-surface italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-primary">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
