import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="flex items-baseline justify-between text-xs uppercase tracking-[0.14em] text-ivory/55">
        <span>
          {label}
          {required && <span className="text-accent"> *</span>}
        </span>
      </span>
      <div className="mt-2">{children}</div>
      {hint && !error && <p className="mt-1.5 text-xs text-ivory/35">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-[#d98b7a]">
          {error}
        </p>
      )}
    </label>
  );
}

export const inputClass =
  "w-full border-b border-line bg-transparent py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/25 focus:border-accent";
