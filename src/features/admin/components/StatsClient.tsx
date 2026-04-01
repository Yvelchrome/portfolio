"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "features/admin/statistics/api";
import { useTranslations } from "next-intl";

import { Bar, Doughnut } from "components/widgets/Charts";
import { EmailStats } from "lib/schemas";

export function StatsClient() {
  const t = useTranslations("Admin");
  const searchParams = useSearchParams();
  const [days, setDays] = useState(30);

  const demoMode = searchParams.get("demo") === "1";

  const { data: stats } = useQuery<EmailStats>({
    queryKey: ["statistics", days, demoMode],
    queryFn: () => getStatistics(days, demoMode),
  });

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
          <Bar data={barData} options={barOptions} />
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
    </div>
  );
}
