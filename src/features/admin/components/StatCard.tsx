"use client";

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
}

export const StatCard = ({
  label,
  value,
  color = "text-primary-text",
}: StatCardProps) => {
  return (
    <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
      <dt className="text-muted-foreground text-fluid-sm truncate font-medium uppercase">
        <span>{label}</span>
      </dt>
      <dd className={`text-fluid-2xl mt-1 font-semibold ${color}`}>
        <span className="no-locale-animation tabular-nums">{value}</span>
      </dd>
    </div>
  );
};
