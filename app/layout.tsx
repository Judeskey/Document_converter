import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SiteHeader from "@/components/SiteHeader";
import AuthButtons from "@/components/AuthButtons";
import GoProButton from "@/components/GoProButton";
import SiteFooter from "@/components/SiteFooter";
import Script from "next/script";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://docconvertor.com";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DocConvertor — Free Online Document & Image Tools",
    template: "%s | DocConvertor",
  },
  description:
    "Convert, merge, split, compress, and OCR documents online. Fast, secure, and simple.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "DocConvertor",
    title: "DocConvertor — Free Online Document & Image Tools",
    description:
      "Convert, merge, split, compress, and OCR documents online. Fast, secure, and simple.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocConvertor — Free Online Document & Image Tools",
    description:
      "Convert, merge, split, compress, and OCR documents online. Fast, secure, and simple.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
          send_page_view: false
        });
      `}
          </Script>
        </>
      )}

      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SiteHeader
            rightSlot={
              <div className="flex items-center gap-3">
                <GoProButton />
                <AuthButtons variant="header" />
              </div>
            }
          />
          {children}
        </Providers>
        <SiteFooter />
      </body>
    </html>
  );
}
