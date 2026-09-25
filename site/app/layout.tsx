import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GOOGLE_ANALYTICS_ID } from "@/lib/analytics";
import { buildWebsiteJsonLd, serializeJsonLd, SITE_ORIGIN } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "World Clock, Time Zone Converter & Meeting Planner | AWORLDTIME.COM",
    template: "%s | AWORLDTIME.COM",
  },
  description: "Check local time worldwide, convert time zones, plan global meetings, and read practical time guides.",
  applicationName: "AWORLDTIME.COM",
  alternates: {
    types: { "application/rss+xml": `${SITE_ORIGIN}/feed.xml` },
  },
  openGraph: {
    type: "website",
    url: `${SITE_ORIGIN}/`,
    siteName: "AWORLDTIME.COM",
    title: "World Clock, Time Zone Converter & Meeting Planner",
    description: "Check local time worldwide, convert time zones, and plan global meetings.",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Clock, Time Zone Converter & Meeting Planner",
    description: "Check local time worldwide, convert time zones, and plan global meetings.",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildWebsiteJsonLd()) }}
        />
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      </body>
    </html>
  );
}
