import { FloralMark } from "@/components/brand/FloralMark";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <FloralMark
        outline
        aria-hidden
        className="h-12 w-12 animate-pulse text-accent/50"
      />
    </div>
  );
}
