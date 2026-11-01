import { cn } from "@/lib/utils";

export function PageTitle({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-4">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {children && <p className="mt-1 text-sm text-ivory/50">{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border border-line bg-ink-800 p-5", className)}
      {...props}
    />
  );
}

export function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.14em] text-ivory/45">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </Card>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-ivory/50">
      {children}
    </span>
  );
}

export const field =
  "w-full border border-line bg-transparent px-3 py-2 text-sm text-ivory outline-none focus:border-accent";

export function SubmitButton({
  children,
  pending,
  variant = "solid",
}: {
  children: React.ReactNode;
  pending?: boolean;
  variant?: "solid" | "ghost" | "danger";
}) {
  const cls = {
    solid: "bg-ivory text-ink hover:bg-accent-soft",
    ghost: "border border-line text-ivory hover:bg-ivory/5",
    danger: "border border-[#7d3b2e] text-[#e9b7ab] hover:bg-[#2a1713]",
  }[variant];
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "px-5 py-2.5 text-xs uppercase tracking-[0.14em] transition-colors disabled:opacity-50",
        cls,
      )}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function Banner({
  kind = "info",
  children,
}: {
  kind?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  const cls = {
    info: "border-line text-ivory/70",
    success: "border-[#3d5a44] text-[#a9d4b4] bg-[#16241a]",
    error: "border-[#7d3b2e] text-[#e9b7ab] bg-[#2a1713]",
  }[kind];
  return (
    <p className={cn("mb-6 border px-4 py-3 text-sm", cls)}>{children}</p>
  );
}
