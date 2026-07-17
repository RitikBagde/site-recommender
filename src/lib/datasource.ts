import localDatasource from "@/config/listing.datasource.json";
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
  return localDatasource as ListingDatasource;
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

  if (error || !data?.length) {
    console.error("[WhereWatch] Supabase listings fetch failed:", error?.message);
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
