import {
  type EmailStats,
  EmailStatsSchema,
  parseJsonWithZod,
} from "lib/schemas";

const API_BASE = "/api/admin/statistics";

export async function getStatistics(
  days: string = "30",
  isDemo: boolean = false,
): Promise<EmailStats> {
  const searchParams = new URLSearchParams();
  searchParams.set("days", days);

  if (isDemo) {
    searchParams.set("demo", "1");
  }

  const response = await fetch(`${API_BASE}?${searchParams}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }

  return parseJsonWithZod(response, EmailStatsSchema);
}
