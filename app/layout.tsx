import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SiteHeader from "@/components/SiteHeader";
import AuthButtons from "@/components/AuthButtons";


// ...

<SiteHeader rightSlot={<AuthButtons />} />



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docconvertor.com"),
  title: {
    default: "DocConvert – Free Online Document & Image Converter",
    template: "%s | DocConvert",
  },
  description:
    "Convert PDFs, images, and documents online for free. Fast, secure document conversion with OCR, compression, and merge tools. No signup required.",
  applicationName: "DocConvert",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SiteHeader rightSlot={<AuthButtons variant="header" />} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
