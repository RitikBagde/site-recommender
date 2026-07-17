import { DiscoveryWorkspace } from "@/components/shared/DiscoveryWorkspace";
import { getListingDatasource } from "@/lib/datasource";
import { Suspense } from "react";

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
