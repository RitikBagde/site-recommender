import type {
  CategoryFilter,
  MediaCategory,
  PlatformListing,
} from "@/types";

export function countUniquePlatforms(listings: PlatformListing[]): number {
  return new Set(listings.map((listing) => listing.name)).size;
}

export function countByCategory(listings: PlatformListing[]) {
  return listings.reduce(
    (counts, listing) => {
      if (listing.paymentModel === "subscription") {
        counts.paid += 1;
        return counts;
      }

      counts[listing.category] += 1;
      return counts;
    },
    {
      movies: 0,
      "tv-shows": 0,
      anime: 0,
      manga: 0,
      "live-sports": 0,
      apps: 0,
      paid: 0,
    } satisfies Record<MediaCategory, number>,
  );
}

const regionAliases: Record<string, string[]> = {
  ALL: ["ALL", "GLOBAL"],
  US: ["US", "UK", "GB"],
  IN: ["IN"],
  DE: ["DE", "EU"],
  FR: ["FR", "EU"],
  JP: ["JP"],
  KR: ["KR"],
  ES: ["ES", "EU"],
  IT: ["IT", "EU"],
  PL: ["PL", "EU"],
  EG: ["EG"],
};

export function filterListings(
  listings: PlatformListing[],
  {
    category,
    region,
  }: {
    category: CategoryFilter;
    region: string;
  },
): PlatformListing[] {
  return listings.filter((listing) => {
    const matchesRegion =
      region === "ALL" ||
      listing.region.some((code) => regionAliases[region]?.includes(code));

    if (!matchesRegion) {
      return false;
    }

    if (category === "all") {
      return true;
    }

    if (category === "paid") {
      return listing.paymentModel === "subscription";
    }

    return listing.paymentModel !== "subscription" && listing.category === category;
  });
}

export function getCategoryLabel(
  category: CategoryFilter,
  categories: { id: MediaCategory; label: string }[],
): string {
  if (category === "all") return "All";
  if (category === "paid") return "Paid";
  return categories.find((item) => item.id === category)?.label ?? "Directory";
}
