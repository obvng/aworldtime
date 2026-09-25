import type { Metadata, Viewport } from "next";
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
