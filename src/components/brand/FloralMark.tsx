import { cn } from "@/lib/utils";

interface Props extends React.SVGProps<SVGSVGElement> {
  /** Render as strokes only (for the line-draw loader animation). */
  outline?: boolean;
}

/**
 * Damascense floral mark — a four-petal mandala abstracted from the official
 * logo symbol. Used for the loader, section dividers, transitions and footer.
 * The real logo art can replace this file once supplied.
 */
export function FloralMark({ outline = false, className, ...props }: Props) {
  const petal = "M50 6 C58 24 58 34 50 50 C42 34 42 24 50 6 Z";
  const inner = "M50 20 C54 32 54 40 50 50 C46 40 46 32 50 20 Z";
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Damascense"
      className={cn("block", className)}
      fill={outline ? "none" : "currentColor"}
      stroke={outline ? "currentColor" : "none"}
      strokeWidth={outline ? 1.25 : 0}
      strokeLinejoin="round"
      {...props}
    >
      <g>
        {[0, 90, 180, 270].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 50 50)`}>
            <path className="petal-outer" d={petal} />
            {outline && <path className="petal-inner" d={inner} opacity={0.5} />}
          </g>
        ))}
        {[45, 135, 225, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 50 50)`} opacity={0.9}>
            <path
              className="petal-diagonal"
              d="M50 14 C55 28 55 36 50 50 C45 36 45 28 50 14 Z"
            />
          </g>
        ))}
        <circle
          className="mark-core"
          cx="50"
          cy="50"
          r={outline ? 5 : 3.4}
          fill={outline ? "none" : "currentColor"}
          stroke={outline ? "currentColor" : "none"}
          strokeWidth={outline ? 1.25 : 0}
        />
      </g>
    </svg>
  );
}
