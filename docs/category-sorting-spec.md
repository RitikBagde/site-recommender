# UI & Data Specification: Strict Paid/Subscription Category Filtering

Use this document as a reference prompt or strict instruction context when modifying the card filtering, directory rendering, or database categorization logic.

## Objective
Implement an absolute "Paid/Subscription" category override. If any application, utility, streaming service, or website in the database requires a paid subscription, it MUST only appear in the "Paid" category. It must be strictly excluded from native content categories (such as Movies, Anime, Manga, or Live TV) to prevent premium paid options from cluttering free or ad-supported resource lists.

---

### 1. Categorization Priority Matrix
When processing and displaying cards, apply the following strict filtering flow:

1.  **Check Monetization/Subscription Status first:**
    *   If `isPaid === true` OR `pricingType === 'Subscription'`:
        *   **Force Grouping:** Place the item **ONLY** in the `Paid` category.
        *   **Strict Exclusion:** Strip or ignore its content category tags (e.g., *Anime*, *Manga*, *Movies & Shows*, *Live TV*) during regular category browsing. It must **not** show up in those lists.
2.  **Free or Ad-Supported Status:**
    *   If the site is `Free` OR `Ad-supported` (e.g., `isPaid === false`):
        *   **Respective Placement:** Map it strictly to its native content categories (e.g., *Anime*, *Manga*, *Movies & Shows*).

---

### 2. Pseudo-code Logic for Code Execution
Ensure the React rendering or filtering state mirrors this exact logic:

```typescript
// Define standard categories
export type Category = 'All' | 'Movies & Shows' | 'Anime' | 'Manga' | 'Live TV' | 'Paid' | 'Apps';

interface DirectoryItem {
  id: string;
  name: string;
  url: string;
  nativeCategory: Exclude<Category, 'All' 'Paid' |>; // e.g., 'Anime' or 'Movies & Shows'
  pricing: 'Free' | 'Ad-supported' | 'Subscription';  // 'Subscription' acts as the Paid trigger
}

// Strictly filter items based on selected category
export const filterDirectoryItems = (items: DirectoryItem[], activeCategory: Category): DirectoryItem[] => {
  if (activeCategory === 'All') {
    return items;
  }

  if (activeCategory === 'Paid') {
    // Paid category ONLY contains subscription/paid sites
    return items.filter(item => item.pricing === 'Subscription');
  }

  // Any other category (Anime, Manga, Movies, etc.) contains ONLY Free & Ad-supported sites
  return items.filter(item => {
    const matchesCategory = item.nativeCategory === activeCategory;
    const isFreeOrAdSupported = item.pricing === 'Free' || item.pricing === 'Ad-supported';
    
    return matchesCategory && isFreeOrAdSupported;
  });
};