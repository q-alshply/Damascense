import {
  Cormorant_Garamond,
  Inter,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
} from "next/font/google";

export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const displayAr = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-ar",
  display: "swap",
});

export const sansAr = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-ar",
  display: "swap",
});

export const fontVariables = [
  display.variable,
  sans.variable,
  displayAr.variable,
  sansAr.variable,
].join(" ");
