import { cn } from "@/lib/utils";

export function Container({
  className,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1600px] px-gutter", className)}
      {...props}
    />
  );
}
