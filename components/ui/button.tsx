import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "text";
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 text-label-caps transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-primary text-on-primary rounded-[24px] hover:opacity-90 shadow-level-2 hover:shadow-level-3 active:scale-[0.98]",
  secondary:
    "bg-transparent border border-primary text-primary rounded-[24px] hover:bg-surface-container active:scale-[0.98]",
  text: "text-primary border-b border-primary pb-0.5 hover:text-secondary hover:border-secondary",
};

const sizes = {
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

/**
 * Per DESIGN.md: primary buttons are solid charcoal / white text with a
 * 24px radius; secondary buttons are outlined; text buttons use the
 * label-caps style with an underline. Renders as <Link> when `href` is
 * provided, otherwise a native <button>.
 */
export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    base,
    variants[variant],
    variant !== "text" && sizes[size],
    className
  );

  if (href) {
    const linkProps = props as Omit<
      ComponentPropsWithoutRef<typeof Link>,
      "className" | "children" | "href"
    >;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
