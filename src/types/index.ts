export type MediaCategory =

  | "movies"

  | "tv-shows"

  | "anime"

  | "manga"

  | "live-sports"

  | "apps"

  | "paid";



export type CategoryFilter = MediaCategory | "all";



export type PaymentModel = "free" | "subscription" | "ad-supported" | "rental";



export interface PlatformListing {

  id: string;

  name: string;

  url: string;

  category: MediaCategory;

  region: string[];

  paymentModel: PaymentModel;

  description?: string;

}



export interface RegionOption {

  code: string;

  label: string;

  flag?: string;

}



export interface CategoryOption {

  id: MediaCategory;

  label: string;

}



export interface ListingDatasource {

  version: number;

  lastUpdated: string;

  regions: RegionOption[];

  categories: CategoryOption[];

  listings: PlatformListing[];

}



export type FeedbackType = "suggestion" | "report";



export interface SuggestionPayload {

  platformName: string;

  url: string;

  category: MediaCategory;

  notes?: string;

}



export interface ReportLinkPayload {

  platformName: string;

  url: string;

  issueType: "broken-link" | "wrong-region" | "outdated-info" | "other";

  description: string;

}



export interface FeedbackSubmission {

  type: FeedbackType;

  payload: SuggestionPayload | ReportLinkPayload;

  submittedAt: string;

}



export interface DataSourceMeta {

  source: "supabase" | "local-json";

  fallbackUsed: boolean;

}


