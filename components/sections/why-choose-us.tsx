import { Gem, Truck, ShieldCheck, Leaf } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import { valueProps } from "@/data/products";

const icons: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  diamond: Gem,
  truck: Truck,
  shield: ShieldCheck,
  leaf: Leaf,
};

export default function WhyChooseUs() {
  return (
    <section id="standard" className="bg-surface px-margin-mobile py-24 md:px-margin-desktop">
      <div className="mx-auto max-w-[1440px] border-t border-surface-variant pt-24">
        <Reveal
          as="div"
          stagger
          className="grid grid-cols-1 gap-12 text-center md:grid-cols-4 md:text-left"
        >
          {valueProps.map((item) => {
            const Icon = icons[item.icon];
            return (
              <div
                key={item.title}
                className="flex flex-col items-center md:items-start"
              >
                <Icon size={36} strokeWidth={1.5} className="mb-6 text-secondary" />
                <h4 className="mb-3 text-display-md text-primary">{item.title}</h4>
                <p className="text-sm text-on-surface-variant">{item.description}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
