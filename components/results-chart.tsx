"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";
import type { ChartDataPoint } from "@/lib/types";

interface ResultsChartProps {
  data: ChartDataPoint[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint; name: string; value: number }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-popover-foreground">
        Index: {point.index}
      </p>
      <p className="text-chart-1">
        Actual: <span className="font-mono">{point.actual.toFixed(4)}</span>
      </p>
      <p className="text-chart-2">
        Predicted:{" "}
        <span className="font-mono">{point.predicted.toFixed(4)}</span>
      </p>
    </div>
  );
}

export function ResultsChart({ data }: ResultsChartProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <LineChartIcon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Actual vs Predicted
        </h2>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(240 4% 16%)"
              opacity={0.5}
            />
            <XAxis
              dataKey="index"
              type="number"
              tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }}
              axisLine={{ stroke: "hsl(240 4% 16%)" }}
              tickLine={{ stroke: "hsl(240 4% 16%)" }}
              label={{
                value: "Sample Index",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 11, fill: "hsl(240 5% 55%)" },
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }}
              axisLine={{ stroke: "hsl(240 4% 16%)" }}
              tickLine={{ stroke: "hsl(240 4% 16%)" }}
              label={{
                value: "Value",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "hsl(240 5% 55%)" },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            />
            <Scatter
              name="Actual"
              data={data}
              dataKey="actual"
              fill="hsl(168 84% 45%)"
              opacity={0.8}
              r={4}
            />
            <Scatter
              name="Predicted"
              data={data}
              dataKey="predicted"
              fill="hsl(217 91% 60%)"
              opacity={0.8}
              r={4}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
