import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteProvider } from "@/components/site-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geist = localFont({
  src: "../public/fonts/geist-latin.ttf",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "projeto.lab — Projects that inspire",
    template: "%s | projeto.lab",
  },
  description:
    "Discover student-led academic projects, connect with curious minds, and share ideas that make a difference. A community of possibility.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SiteProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SiteProvider>
      </body>
    </html>
  );
}
