"use client";

import { Activity, GitBranch, Target, Layers } from "lucide-react";
import type { ModelType, ProblemType, TrainConfig } from "@/lib/types";

interface ConfigPanelProps {
  columns: string[];
  config: TrainConfig;
  onConfigChange: (config: TrainConfig) => void;
  onTrain: () => void;
  isTraining: boolean;
}

const MODEL_OPTIONS: { value: ModelType; label: string; description: string }[] = [
  {
    value: "linear_regression",
    label: "Linear Regression",
    description: "Normal equation with pseudo-inverse",
  },
  {
    value: "knn",
    label: "K-Nearest Neighbors",
    description: "Distance-based with k=3",
  },
];

const PROBLEM_OPTIONS: { value: ProblemType; label: string }[] = [
  { value: "regression", label: "Regression" },
  { value: "classification", label: "Classification" },
];

export function ConfigPanel({
  columns,
  config,
  onConfigChange,
  onTrain,
  isTraining,
}: ConfigPanelProps) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Model Configuration
        </h2>
      </div>

      {/* Model Selection */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5" />
          Algorithm
        </label>
        <div className="flex flex-col gap-2">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onConfigChange({ ...config, model: opt.value })}
              className={`flex flex-col items-start rounded-md border px-3 py-2.5 text-left transition-colors ${
                config.model === opt.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-border hover:bg-secondary/60"
              }`}
            >
              <span className="text-sm font-medium">{opt.label}</span>
              <span className="text-xs text-muted-foreground">
                {opt.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Problem Type */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Layers className="h-3.5 w-3.5" />
          Problem Type
        </label>
        <div className="flex gap-2">
          {PROBLEM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onConfigChange({ ...config, problemType: opt.value })
              }
              className={`flex-1 rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors ${
                config.problemType === opt.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Column */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Target className="h-3.5 w-3.5" />
          Target Column
        </label>
        <select
          value={config.target}
          onChange={(e) =>
            onConfigChange({ ...config, target: e.target.value })
          }
          className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="" className="bg-card text-muted-foreground">
            Select target...
          </option>
          {columns.map((col) => (
            <option key={col} value={col} className="bg-card text-foreground">
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Train Button */}
      <button
        onClick={onTrain}
        disabled={!config.target || isTraining}
        className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isTraining ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            Training...
          </>
        ) : (
          "Train Model"
        )}
      </button>
    </div>
  );
}
