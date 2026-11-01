import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

const base =
  "group inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2";

const variants: Record<Variant, string> = {
  solid: "bg-ivory px-7 py-4 text-ink hover:bg-accent-soft",
  outline:
    "border border-ivory/25 px-7 py-4 text-ivory hover:border-ivory hover:bg-ivory/5",
  ghost: "text-ivory hover:text-accent-soft",
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-300 will-change-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100"
    >
      →
    </span>
  );
}

export function CTALink({
  href,
  children,
  variant = "outline",
  className,
  withArrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </Link>
  );
}

export function CTAButton({
  children,
  variant = "solid",
  className,
  withArrow = true,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  withArrow?: boolean;
}) {
  return (
    <button
      className={cn(base, variants[variant], "disabled:opacity-50", className)}
      {...props}
    >
      <span>{children}</span>
      {withArrow && <Arrow />}
    </button>
  );
}
