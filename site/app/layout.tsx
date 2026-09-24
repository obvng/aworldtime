import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWORLDTIME.COM",
  description: "Local time, world clocks, time conversion, and practical guides.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
