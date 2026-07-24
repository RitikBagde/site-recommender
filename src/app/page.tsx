import { DiscoveryWorkspace } from "@/components/shared/DiscoveryWorkspace";
import { getListingDatasource } from "@/lib/datasource";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "WhereWatch — Discover Streaming Platforms by Region",
  description:
    "Explore 120+ streaming, reading, and media platforms across 10 regions. Filter by category, search by name, bookmark favorites, and discover where to watch.",
  openGraph: {
    title: "WhereWatch — Discover Streaming Platforms by Region",
    description:
      "Explore 120+ streaming, reading, and media platforms across 10 regions.",
    url: "/",
  },
};

export default async function Home() {
  const { data, meta } = await getListingDatasource();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-bg">
          <p className="text-sm text-muted">Loading directory...</p>
        </div>
      }
    >
      <DiscoveryWorkspace data={data} dataMeta={meta} />
    </Suspense>
  );
}
