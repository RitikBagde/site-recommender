import type { Metadata } from "next";
import { ArrowLeft, Globe2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — WhereWatch",
  description:
    "WhereWatch helps you explore streaming, reading, and media platforms across regions. Discover platforms by region, category, and search — all in one place.",
  openGraph: {
    title: "About — WhereWatch",
    description:
      "Discover streaming, reading, and media platforms across regions with WhereWatch.",
    url: "/about",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About WhereWatch",
      },
    ],
  },
  twitter: {
    title: "About — WhereWatch",
    description:
      "Discover streaming, reading, and media platforms across regions with WhereWatch.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to directory
        </Link>

        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border bg-brand-surface">
            <Globe2 className="h-5 w-5 text-brand-glow" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary sm:text-2xl">About WhereWatch</h1>
            <p className="text-sm text-muted">Discover streaming and reading services</p>
          </div>
        </div>

        <p className="mt-6 leading-7 text-muted">
          WhereWatch helps you explore streaming, reading, and media platforms across regions.
          The workspace keeps search, filtering, and bookmarks in sync so you can jump straight
          to the most relevant options without friction.
        </p>

        <div className="mt-8 space-y-5">
          <div className="rounded-lg border border-brand-border/50 bg-brand-surface/30 p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Privacy-first approach</h2>
            <p className="mt-2 leading-7 text-muted">
              Your preferences — bookmarks, region, and category filters — are stored locally in your browser.
              No accounts, no tracking, no personal data collected.
            </p>
          </div>

          <div className="rounded-lg border border-brand-border/50 bg-brand-surface/30 p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">How it works</h2>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-muted">
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-brand-glow">1.</span>
                <span>Select a region to see platforms available in that area.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-brand-glow">2.</span>
                <span>Filter by category — Movies, TV Shows, Anime, Manga, Live Sports, or Apps.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-brand-glow">3.</span>
                <span>Search for a specific platform by name or URL.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 shrink-0 text-brand-glow">4.</span>
                <span>Pin your favorites for quick access across sessions.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-brand-border/50 bg-brand-surface/30 p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Suggest a platform</h2>
            <p className="mt-2 leading-7 text-muted">
              Know a platform that should be listed? Use the Suggest button in the bottom-left corner
              to recommend it. Found a broken link or outdated info? The Report link button lets you
              flag issues so the directory stays accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}