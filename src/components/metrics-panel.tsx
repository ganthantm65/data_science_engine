"use client";

import { BarChart3, TrendingDown, Target, Gauge } from "lucide-react";
import type { RegressionMetrics, ClassificationMetrics } from "@/lib/types";

interface MetricsPanelProps {
  metrics: RegressionMetrics | ClassificationMetrics;
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Evaluation Metrics
        </h2>
        <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {metrics.type === "regression" ? "Regression" : "Classification"}
        </span>
      </div>

      {metrics.type === "regression" ? (
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Mean Squared Error"
            value={metrics.mse.toFixed(6)}
            icon={TrendingDown}
            color="text-chart-1"
          />
          <MetricCard
            label="Mean Absolute Error"
            value={metrics.mae.toFixed(6)}
            icon={Target}
            color="text-chart-2"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <MetricCard
            label="Accuracy"
            value={`${(metrics.accuracy * 100).toFixed(2)}%`}
            icon={Gauge}
            color="text-chart-1"
          />
        </div>
      )}
    </div>
  );
}
