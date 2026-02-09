import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GeoDex",
    template: "%s | GeoDex"
  },
  description:
    "GeoDex (Géodex) est une application française de quiz de géographie : drapeaux, capitales, pays, continents et culture générale.",
  applicationName: "GeoDex",
  keywords: [
    "GeoDex",
    "Géodex",
    "quiz géographie",
    "jeu de drapeaux",
    "capitales",
    "pays",
    "continents",
    "frontières",
    "culture générale",
    "jeu éducatif",
    "géographie"
  ],
  authors: [{ name: "Mahylan VECLIN" }],
  creator: "Mahylan VECLIN",
  publisher: "Mahylan VECLIN",
  category: "Education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "GeoDex — Jeu de géographie",
    description:
      "Quiz de géographie en français : drapeaux, capitales, pays, continents et culture générale.",
    siteName: "GeoDex",
    images: [
      {
        url: "/opengraph-image",
        alt: "GeoDex — Quiz de géographie"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GeoDex — Jeu de géographie",
    description:
      "Quiz de géographie en français : drapeaux, capitales, pays, continents et culture générale.",
    images: ["/twitter-image"]
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  appleWebApp: {
    capable: true,
    title: "GeoDex",
    statusBarStyle: "black-translucent"
  },
  alternates: {
    canonical: "/"
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
  colorScheme: "light",
  viewportFit: "cover"
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "GeoDex",
      alternateName: "Géodex",
      url: siteUrl,
      description:
        "Application française de quiz de géographie : drapeaux, capitales, pays, continents et culture générale.",
      inLanguage: "fr-FR",
      author: {
        "@type": "Person",
        name: "Mahylan VECLIN"
      },
      publisher: {
        "@type": "Person",
        name: "Mahylan VECLIN"
      }
    },
    {
      "@type": "WebApplication",
      name: "GeoDex",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      url: siteUrl,
      inLanguage: "fr-FR",
      author: {
        "@type": "Person",
        name: "Mahylan VECLIN"
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR"
      }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NavBar />
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
