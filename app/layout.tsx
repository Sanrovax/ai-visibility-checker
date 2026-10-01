import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Visibility Checker | Free tool by Sanrovax",
  description:
    "Free AI Visibility Checker for Indian businesses. See if AI assistants like Google Gemini and ChatGPT recommend your business, or your competitor, when customers ask.",
  metadataBase: new URL("https://aivisibility.sanrovax.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Visibility Checker | Sanrovax",
    description: "Is AI recommending your business, or your competitor? Check free in under a minute.",
    url: "https://aivisibility.sanrovax.com",
    siteName: "Sanrovax",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F766E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
