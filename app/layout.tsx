import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollPlayhead from "@/components/editor/ScrollPlayhead";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://robydevera.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Roby De Vera",
    template: "Roby De Vera • %s",
  },
  description:
    "Roby De Vera is a video editor crafting rhythm, story and motion for brands, artists and filmmakers.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Roby De Vera",
    title: "Roby De Vera",
    description:
      "Video editor crafting rhythm, story and motion for brands, artists and filmmakers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roby De Vera",
    description:
      "Video editor crafting rhythm, story and motion for brands, artists and filmmakers.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-base text-ink">
        <div className="grain" aria-hidden="true" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollPlayhead />
      </body>
    </html>
  );
}
