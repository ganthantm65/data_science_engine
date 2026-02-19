"use client";

import { useState } from "react";
import { Wand2, ArrowRight } from "lucide-react";

interface PredictPanelProps {
  featureColumns: string[];
  onPredict: (features: number[]) => Promise<number[] | null>;
}

export function PredictPanel({
  featureColumns,
  onPredict,
}: PredictPanelProps) {
  const [features, setFeatures] = useState<string[]>(
    featureColumns.map(() => "")
  );
  const [result, setResult] = useState<number[] | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePredict = async () => {
    const parsed = features.map(Number);
    if (parsed.some(isNaN)) return;
    setIsPredicting(true);
    const prediction = await onPredict(parsed);
    setResult(prediction);
    setIsPredicting(false);
  };

  const isValid = features.every((f) => f !== "" && !isNaN(Number(f)));

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Wand2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Make Prediction
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {featureColumns.map((col, i) => (
          <div key={col} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {col}
            </label>
            <input
              type="number"
              value={features[i]}
              onChange={(e) => {
                const next = [...features];
                next[i] = e.target.value;
                setFeatures(next);
              }}
              placeholder="0.0"
              className="rounded-md border border-border bg-secondary/30 px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePredict}
          disabled={!isValid || isPredicting}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPredicting ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Predicting...
            </>
          ) : (
            <>
              Predict <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>

        {result !== null && (
          <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Result:
            </span>
            <span className="font-mono text-lg font-bold text-primary">
              {result.map((v) => v.toFixed(4)).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
