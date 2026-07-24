import localDatasource from "@/config/listing.datasource.json";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  DataSourceMeta,
  ListingDatasource,
  MediaCategory,
  PaymentModel,
  PlatformListing,
} from "@/types";

const VALID_CATEGORIES: MediaCategory[] = [
  "movies",
  "tv-shows",
  "anime",
  "manga",
  "live-sports",
  "apps",
];

const VALID_PAYMENT: PaymentModel[] = [
  "free",
  "subscription",
  "ad-supported",
  "rental",
];

function getLocalDatasource(): ListingDatasource {
  const meta = localDatasource as ListingDatasource;
  const configDir = resolve(process.cwd(), "src", "config");

  const files = readdirSync(configDir).filter(
    (f) => f.endsWith(".json") && f !== "listing.datasource.json",
  );
  const allListings: PlatformListing[] = [];

  for (const file of files) {
    const raw = readFileSync(resolve(configDir, file), "utf-8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data.listings)) continue;

    const regionCode = file.replace(/\.json$/, "").split("_").pop()?.toUpperCase() ?? "GLOBAL";

    for (const entry of data.listings) {
      if (entry.enabled === false) continue;
      const normalized = normalizeListing(entry);
      if (!normalized) continue;
      normalized.region = normalized.region.map((r) => r.toUpperCase());
      normalized._source = regionCode;
      allListings.push(normalized);
    }
  }

  for (const entry of meta.listings) {
    const normalized = normalizeListing(entry as unknown as Record<string, unknown>);
    if (!normalized) continue;
    normalized.region = normalized.region.map((r) => r.toUpperCase());
    normalized._source = "GLOBAL";
    allListings.push(normalized);
  }

  return { ...meta, listings: allListings };
}

function normalizeListing(row: Record<string, unknown>): PlatformListing | null {
  const id = typeof row.id === "string" ? row.id : null;
  const name = typeof row.name === "string" ? row.name : null;
  const url = typeof row.url === "string" ? row.url : null;
  const category = typeof row.category === "string" ? row.category : null;
  const paymentModel =
    typeof row.payment_model === "string"
      ? row.payment_model
      : typeof row.paymentModel === "string"
        ? row.paymentModel
        : null;
  const region = Array.isArray(row.region)
    ? row.region.filter((value): value is string => typeof value === "string")
    : null;
  const description =
    typeof row.description === "string" ? row.description : undefined;

  if (
    !id ||
    !name ||
    !url ||
    !category ||
    !paymentModel ||
    !region ||
    !VALID_CATEGORIES.includes(category as MediaCategory) ||
    !VALID_PAYMENT.includes(paymentModel as PaymentModel)
  ) {
    return null;
  }

  return {
    id,
    name,
    url,
    category: category as MediaCategory,
    region,
    paymentModel: paymentModel as PaymentModel,
    description,
  };
}

async function fetchFromSupabase(): Promise<ListingDatasource | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("platform_listings")
    .select("id,name,url,category,region,payment_model,description");

  if (error) {
    console.error("[WhereWatch] Supabase listings fetch failed:", error.message);
    return null;
  }

  if (!data?.length) {
    return null;
  }

  const listings = data
    .map((row) => normalizeListing(row as Record<string, unknown>))
    .filter((listing): listing is PlatformListing => listing !== null);

  if (!listings.length) {
    return null;
  }

  const local = getLocalDatasource();

  return {
    version: local.version,
    lastUpdated: new Date().toISOString().slice(0, 10),
    regions: local.regions,
    categories: local.categories,
    listings,
  };
}

export async function getListingDatasource(): Promise<{
  data: ListingDatasource;
  meta: DataSourceMeta;
}> {
  const local = getLocalDatasource();

  if (!isSupabaseConfigured()) {
    return {
      data: local,
      meta: { source: "local-json", fallbackUsed: false },
    };
  }

  try {
    const remote = await fetchFromSupabase();

    if (remote) {
      return {
        data: remote,
        meta: { source: "supabase", fallbackUsed: false },
      };
    }
  } catch (error) {
    console.error("[WhereWatch] Supabase datasource error:", error);
  }

  return {
    data: local,
    meta: { source: "local-json", fallbackUsed: true },
  };
}
