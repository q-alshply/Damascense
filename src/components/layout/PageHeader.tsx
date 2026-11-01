import { Container } from "@/components/ui/Container";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <Container as="header">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="mt-4 font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95]">
        {title}
      </h1>
      {lead && (
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/60">
          {lead}
        </p>
      )}
    </Container>
  );
}
