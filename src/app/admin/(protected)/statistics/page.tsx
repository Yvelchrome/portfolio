"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Bar, ChartLoading, Doughnut } from "components/widgets/Charts";
import { SelectFilter, StatCard } from "features/admin/components";
import { useReplaceUrl } from "features/admin/hooks/useReplaceUrl";
import { useSearchParamsSafe } from "features/admin/hooks/useSearchParamsSafe";
import { getStatistics } from "features/admin/statistics/api";
import { EmailStats } from "lib/schemas";

export default function EmailStatsPage() {
  const t = useTranslations("Admin");

  const { demo, days } = useSearchParamsSafe(["demo", "days"], {
    demo: "0",
    days: "30",
  });
  const isDemo = demo === "1";

  const replaceUrl = useReplaceUrl(isDemo);

  const { data: stats, isFetching } = useQuery<EmailStats>({
    queryKey: ["statistics", days, isDemo],
    queryFn: () => getStatistics(days, isDemo),
  });

  const handleDaysChange = (newDays: string) => {
    replaceUrl({ days: newDays });
  };

  const barData = {
    labels: [
      t("statistics.sent"),
      t("statistics.delivered"),
      t("statistics.bounced"),
      t("statistics.failed"),
    ],
    datasets: [
      {
        label: t("statistics.title"),
        data: [
          stats?.summary.sent || 0,
          stats?.summary.delivered || 0,
          stats?.summary.bounced || 0,
          stats?.summary.failed || 0,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: t("statistics.email_performance") },
    },
  };

  const issuesCount =
    (stats?.summary.bounced || 0) + (stats?.summary.failed || 0);

  const doughnutData = {
    labels: [t("statistics.delivered"), t("statistics.issues")],
    datasets: [
      {
        data: [stats?.summary.delivered || 0, issuesCount],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" as const },
      title: { display: true, text: t("statistics.delivery_breakdown") },
    },
  };

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-primary-text text-fluid-2xl font-bold">
          {t("statistics.title")}
        </h1>
        <SelectFilter
          value={days}
          onChange={handleDaysChange}
          options={[
            { value: "7", label: t("statistics.last_7_days") },
            { value: "30", label: t("statistics.last_30_days") },
            { value: "90", label: t("statistics.last_90_days") },
          ]}
        />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3">
        <StatCard
          label={t("statistics.total_sent")}
          value={stats?.summary.totalSent || 0}
          color="text-blue-500"
        />
        <StatCard
          label={t("statistics.delivered")}
          value={stats?.summary.delivered || 0}
          color="text-green-500"
        />
        <StatCard
          label={t("statistics.delivery_rate")}
          value={`${stats?.summary.deliveryRate || "0"}%`}
          color="text-teal-500"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 transition-all duration-300 lg:grid-cols-2">
        <div
          className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6"
          style={{
            minHeight: "clamp(250px, 40vw, 400px)",
          }}
        >
          {isFetching ? (
            <ChartLoading />
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
        <div
          className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6"
          style={{
            minHeight: "clamp(250px, 40vw, 400px)",
          }}
        >
          {isFetching ? (
            <ChartLoading />
          ) : (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          )}
        </div>
      </div>
      <div className="bg-card mt-6 overflow-hidden rounded-lg p-4 shadow sm:mt-8 sm:p-6">
        <h3 className="text-card-foreground text-fluid-base mb-3 font-semibold sm:mb-4">
          {t("statistics.detailed_metrics")}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="bg-muted/50 rounded p-3 text-center shadow sm:p-4">
            <p className="text-muted-foreground text-fluid-sm">
              {t("statistics.sent")}
            </p>
            <p className="text-foreground no-locale-animation text-fluid-2xl mt-1 font-bold">
              {stats?.summary.sent || 0}
            </p>
          </div>
          <div className="bg-muted/50 rounded p-3 text-center shadow sm:p-4">
            <p className="text-muted-foreground text-fluid-sm">
              {t("statistics.delivered")}
            </p>
            <p className="text-foreground no-locale-animation text-fluid-2xl mt-1 font-bold">
              {stats?.summary.delivered || 0}
            </p>
          </div>
          <div className="bg-muted/50 rounded p-3 text-center shadow sm:p-4">
            <p className="text-muted-foreground text-fluid-sm">
              {t("statistics.bounced")}
            </p>
            <p className="text-destructive no-locale-animation text-fluid-2xl mt-1 font-bold">
              {stats?.summary.bounced || 0}
            </p>
          </div>
          <div className="bg-muted/50 rounded p-3 text-center shadow sm:p-4">
            <p className="text-muted-foreground text-fluid-sm">
              {t("statistics.failed")}
            </p>
            <p className="text-destructive no-locale-animation text-fluid-2xl mt-1 font-bold">
              {stats?.summary.failed || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
