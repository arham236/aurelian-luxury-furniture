import Link from "next/link";
import { Camera, PinIcon } from "lucide-react";

const companyLinks = [
  { label: "Our Story", href: "#" },
  { label: "Sustainability", href: "#" },
  { label: "Craftsmanship", href: "#" },
];

const supportLinks = [
  { label: "Shipping & Returns", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="block w-full bg-surface-container-low">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-gutter border-t border-surface-variant px-margin-mobile py-16 md:grid-cols-4 md:px-margin-desktop md:py-20">
        <div className="md:col-span-1">
          <Link href="#top" className="mb-6 block text-headline-lg-mobile text-primary md:text-headline-lg">
            AURELIAN
          </Link>
          <p className="mb-6 text-sm text-on-surface-variant">
            Curated luxury furniture for modern sanctuaries.
          </p>
        </div>

        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Support" links={supportLinks} />

        <div className="flex flex-col gap-4">
          <h4 className="mb-2 text-label-caps font-semibold text-primary">
            Connect
          </h4>
          <div className="flex gap-4">
            <a
              aria-label="Instagram"
              href="#"
              className="text-on-surface-variant transition-colors hover:text-secondary"
            >
              <Camera size={20} strokeWidth={1.5} />
            </a>
            <a
              aria-label="Pinterest"
              href="#"
              className="text-on-surface-variant transition-colors hover:text-secondary"
            >
              <PinIcon size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] border-t border-surface-variant/50 px-margin-mobile pb-8 pt-4 text-center md:px-margin-desktop">
        <p className="text-sm text-on-surface-variant">
          © {new Date().getFullYear()} Aurelian Living. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="mb-2 text-label-caps font-semibold text-primary">{title}</h4>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-body-md text-on-surface-variant transition-colors hover:text-secondary"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
