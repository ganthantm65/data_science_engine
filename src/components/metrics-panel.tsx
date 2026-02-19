"use client";

import { BarChart3, TrendingDown, Target, CheckCircle2 } from "lucide-react";
import type { RegressionMetrics, ClassificationMetrics } from "@/lib/types";

interface MetricsPanelProps {
  metrics: RegressionMetrics | ClassificationMetrics;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground font-mono">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  if (metrics.type === "classification") {
    const accuracy = (metrics as ClassificationMetrics).accuracy;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Evaluation Metrics
          </h2>
          <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Classification
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricCard
            icon={CheckCircle2}
            label="Accuracy"
            value={`${(accuracy * 100).toFixed(1)}%`}
            subtitle="Correct predictions ratio"
          />
          <MetricCard
            icon={Target}
            label="Error Rate"
            value={`${((1 - accuracy) * 100).toFixed(1)}%`}
            subtitle="Incorrect predictions ratio"
          />
        </div>
      </div>
    );
  }

  const regMetrics = metrics as RegressionMetrics;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Evaluation Metrics
        </h2>
        <span className="ml-auto rounded-full bg-chart-2/10 px-2.5 py-0.5 text-xs font-medium text-chart-2">
          Regression
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricCard
          icon={TrendingDown}
          label="Mean Squared Error"
          value={regMetrics.mse.toFixed(4)}
          subtitle="Average squared difference"
        />
        <MetricCard
          icon={Target}
          label="Mean Absolute Error"
          value={regMetrics.mae.toFixed(4)}
          subtitle="Average absolute difference"
        />
      </div>
    </div>
  );
}
