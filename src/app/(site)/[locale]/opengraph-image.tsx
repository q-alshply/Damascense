import { ImageResponse } from "next/og";

// Link preview card for WhatsApp, Instagram, Facebook, etc. Product pages
// override this with their own cover image (see generateMetadata there).
export const alt = "Damascense Studio — Contemporary Damascene Decor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const petal = "M50 6 C58 24 58 34 50 50 C42 34 42 24 50 6 Z";
const diagonal = "M50 14 C55 28 55 36 50 50 C45 36 45 28 50 14 Z";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#11110f",
          color: "#f2efe7",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="#c9b48f">
          {[0, 90, 180, 270].map((deg) => (
            <path key={deg} d={petal} transform={`rotate(${deg} 50 50)`} />
          ))}
          {[45, 135, 225, 315].map((deg) => (
            <path key={deg} d={diagonal} transform={`rotate(${deg} 50 50)`} opacity={0.9} />
          ))}
          <circle cx="50" cy="50" r="3.4" />
        </svg>
        <div style={{ marginTop: 48, fontSize: 84, fontFamily: "serif", letterSpacing: -1 }}>
          Damascense
        </div>
        <div style={{ marginTop: 8, fontSize: 22, letterSpacing: 14, color: "#9a886b" }}>
          STUDIO
        </div>
        <div style={{ marginTop: 40, fontSize: 28, color: "rgba(242,239,231,0.6)" }}>
          Mirrors · Clocks · Wooden Crafts — Damascus
        </div>
      </div>
    ),
    size,
  );
}
