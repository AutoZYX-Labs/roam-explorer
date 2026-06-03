import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import SWRegister from "@/components/sw-register";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL("https://roam-explorer.autozyx.com"),
  title: "ROAM Explorer — L4 Robotaxi Incident Database",
  description:
    "Interactive explorer for the ROAM open-source database of L4+ robotaxi operational anomalies, scenario taxonomy, and reference architecture.",
  manifest: "/manifest.json",
  openGraph: {
    title: "ROAM Explorer — L4 Robotaxi Incident Database",
    description:
      "Interactive explorer for the ROAM open-source database of L4+ robotaxi operational anomalies, scenario taxonomy, and reference architecture.",
    url: "https://roam-explorer.autozyx.com/",
    siteName: "ROAM Explorer",
    images: [
      {
        url: "https://roam.autozyx.com/assets/logo.png",
        alt: "ROAM logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROAM Explorer — L4 Robotaxi Incident Database",
    description:
      "Interactive explorer for the ROAM open-source database of L4+ robotaxi operational anomalies, scenario taxonomy, and reference architecture.",
    images: ["https://roam.autozyx.com/assets/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ROAM Explorer",
  },
};

export const viewport: Viewport = {
  themeColor: "#c85a3a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col">
        <I18nProvider>
          <Nav />
          <main className="mx-auto max-w-5xl w-full px-4 py-8 flex-1">{children}</main>
          <Footer />
        </I18nProvider>
        <SWRegister />
      </body>
    </html>
  );
}
