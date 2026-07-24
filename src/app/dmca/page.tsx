import type { Metadata } from "next";
import { DmcaContent } from "./DmcaContent";

export const metadata: Metadata = {
  title: "DMCA Policy — WhereWatch",
  description:
    "Copyright takedown requests and DMCA compliance for WhereWatch directory service. Learn how to submit a copyright infringement complaint.",
  openGraph: {
    title: "DMCA Policy — WhereWatch",
    description:
      "Copyright takedown requests and DMCA compliance for WhereWatch directory service.",
  },
};

export default function DmcaPage() {
  return <DmcaContent />;
}