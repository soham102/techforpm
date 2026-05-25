import type { Metadata } from "next";
import { PMAnalyticsLab } from "@/components/sql-pm/pm-lab";

export const metadata: Metadata = {
  title: "SQL for Product Managers — PMverse",
  description:
    "Practice SQL, analyze business metrics, and solve real PM scenarios through interactive simulations. Think like a data-driven Product Manager.",
};

export default function SQLForPMsPage() {
  return <PMAnalyticsLab />;
}
