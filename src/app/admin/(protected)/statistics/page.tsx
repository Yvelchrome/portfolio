"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { getStatistics } from "features/admin/statistics/api";
import { useTranslations } from "next-intl";
import { Bar, Doughnut } from "react-chartjs-2";

import { EmailStats } from "lib/schemas";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function EmailStatsPage() {
  const t = useTranslations("Admin");
  const searchParams = useSearchParams();
  const [days, setDays] = useState(30);

  const demoMode = searchParams.get("demo") === "1";

  const { data: stats, isLoading } = useQuery<EmailStats>({
    queryKey: ["statistics", days, demoMode],
    queryFn: () => getStatistics(days, demoMode),
  });

  const barChartData = {
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

  const barChartOptions = {
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

  const timeRangeOptions: { value: number; label: string }[] = [
    { value: 7, label: t("statistics.last_7_days") },
    { value: 30, label: t("statistics.last_30_days") },
    { value: 90, label: t("statistics.last_90_days") },
  ];

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-primary-text text-fluid-2xl font-bold">
          {t("statistics.title")}
        </h1>
        <select
          value={days}
          onChange={(e) => {
            setDays(Number(e.target.value));
          }}
          className="border-border bg-card text-foreground text-fluid-base w-full cursor-pointer rounded-md border px-3 py-2 sm:w-auto sm:px-4"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6"
              >
                <div className="bg-muted h-3 w-20 animate-pulse rounded sm:h-4 sm:w-24" />
                <div className="bg-muted mt-2 h-6 w-12 animate-pulse rounded sm:h-8 sm:w-16" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 transition-all duration-300 lg:grid-cols-2">
            <div className="bg-card flex min-h-64 items-center justify-center overflow-hidden rounded-lg p-4 shadow sm:min-h-75 sm:p-6">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent sm:h-8 sm:w-8" />
            </div>
            <div className="bg-card flex min-h-64 items-center justify-center overflow-hidden rounded-lg p-4 shadow sm:min-h-75 sm:p-6">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent sm:h-8 sm:w-8" />
            </div>
          </div>
          <div className="bg-card mt-6 overflow-hidden rounded-lg p-4 shadow sm:mt-8 sm:p-6">
            <div className="bg-muted mb-3 h-5 w-32 animate-pulse rounded sm:mb-4 sm:h-6 sm:w-40" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted/50 rounded p-3 text-center sm:p-4"
                >
                  <div className="bg-muted mx-auto h-3 w-12 animate-pulse rounded sm:h-4 sm:w-16" />
                  <div className="bg-muted mx-auto mt-1 h-5 w-8 animate-pulse rounded sm:mt-2 sm:h-8 sm:w-12" />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3">
            <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
              <h3 className="text-muted-foreground text-fluid-sm font-medium uppercase">
                {t("statistics.total_sent")}
              </h3>
              <p className="no-locale-animation text-fluid-2xl mt-1 font-bold text-blue-500">
                {stats?.summary.totalSent || 0}
              </p>
            </div>
            <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
              <h3 className="text-muted-foreground text-fluid-sm font-medium uppercase">
                {t("statistics.delivered")}
              </h3>
              <p className="no-locale-animation text-fluid-2xl mt-1 font-bold text-green-500">
                {stats?.summary.delivered || 0}
              </p>
            </div>
            <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
              <h3 className="text-muted-foreground text-fluid-sm font-medium uppercase">
                {t("statistics.delivery_rate")}
              </h3>
              <p className="no-locale-animation text-fluid-2xl mt-1 font-bold text-teal-500">
                {stats?.summary.deliveryRate || "0"}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 transition-all duration-300 lg:grid-cols-2">
            <div
              className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6"
              style={{
                minHeight: "clamp(250px, 40vw, 400px)",
              }}
            >
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div
              className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6"
              style={{
                minHeight: "clamp(250px, 40vw, 400px)",
              }}
            >
              <Doughnut data={doughnutData} options={doughnutOptions} />
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
        </>
      )}
    </div>
  );
}
