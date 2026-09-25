import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GOOGLE_ANALYTICS_ID } from "@/lib/analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWORLDTIME.COM",
  description: "Local time, world clocks, time conversion, and practical guides.",
  verification: {
    google: "SsFYfch7pPzhqxvKb0WBvhV9_EJ2pC0DeP-DyrJ7UaE",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      </body>
    </html>
  );
}
