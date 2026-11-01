import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-3", className)}>
      <span aria-hidden className="h-px w-8 bg-accent/60" />
      {children}
    </span>
  );
}
