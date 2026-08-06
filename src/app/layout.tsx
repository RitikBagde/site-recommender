import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PromoBanner } from "@/components/shared/PromoBanner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WhereWatch — Discover Streaming Platforms by Region",
    template: "%s — WhereWatch",
  },
  description:
    "Explore 120+ streaming, reading, and media platforms across 10 regions. Filter by category, search by name, bookmark favorites, and discover where to watch.",
  keywords: [
    "streaming",
    "platforms",
    "discovery",
    "where to watch",
    "movies",
    "tv shows",
    "anime",
    "manga",
    "live sports",
  ],
  authors: [{ name: "WhereWatch" }],
  creator: "WhereWatch",
  publisher: "WhereWatch",
  metadataBase: new URL("https://wherewatch.in"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "WhereWatch",
    title: "WhereWatch — Discover Streaming Platforms by Region",
    description:
      "Explore 120+ streaming, reading, and media platforms across 10 regions. Filter by category, search by name, bookmark favorites, and discover where to watch.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WhereWatch — Streaming Platform Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhereWatch — Discover Streaming Platforms by Region",
    description:
      "Explore 120+ streaming, reading, and media platforms across 10 regions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const themeScript = `
(function(){try{var t=localStorage.getItem('wherewatch:theme')||'dark',d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WhereWatch",
  url: "https://wherewatch.in",
  description:
    "Explore 120+ streaming, reading, and media platforms across 10 regions.",
  inLanguage: "en-US",
  applicationCategory: "Directory",
  operatingSystem: "All",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* <script src="https://pl30713150.effectivecpmnetwork.com/28/6f/1f/286f1fde249c99fe52110acb99777aac.js" async /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-brand-bg font-sans text-primary antialiased`}
      >
        <ThemeProvider>
          <PromoBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
