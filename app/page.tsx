"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Header } from "@/components/header";
import { UploadPanel } from "@/components/upload-panel";
import { ConfigPanel } from "@/components/config-panel";
import { MetricsPanel } from "@/components/metrics-panel";
import { ResultsChart } from "@/components/results-chart";
import { PredictPanel } from "@/components/predict-panel";
import { WorkflowSteps } from "@/components/workflow-steps";
import type {
  DatasetPreview,
  TrainConfig,
  TrainResponse,
  ChartDataPoint,
} from "@/lib/types";

type Step = "upload" | "configure" | "train" | "results" | "predict";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DatasetPreview | null>(null);
  const [config, setConfig] = useState<TrainConfig>({
    model: "linear_regression",
    target: "",
    problemType: "regression",
  });
  const [step, setStep] = useState<Step>("upload");
  const [isTraining, setIsTraining] = useState(false);
  const [trainResult, setTrainResult] = useState<TrainResponse | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setTrainResult(null);
    setChartData([]);

    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      preview: 100,
      complete: (results) => {
        const columns = results.meta.fields ?? [];
        const rows = (results.data as Record<string, string | number>[]).filter(
          (row) => Object.values(row).some((v) => v !== null && v !== "")
        );
        setPreview({ columns, rows, rowCount: rows.length });
        setStep("configure");
      },
    });
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setConfig((c) => ({ ...c, target: "" }));
    setTrainResult(null);
    setChartData([]);
    setStep("upload");
  }, []);

  const handleTrain = useCallback(async () => {
    if (!file || !config.target) return;

    setIsTraining(true);
    setStep("train");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", config.model);
      formData.append("target", config.target);
      formData.append("problemType", config.problemType);

      const res = await fetch("/api/train", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Training failed");

      const data = await res.json();
      setTrainResult(data);
      setChartData(data.chartData ?? []);
      setStep("results");
    } catch {
      setStep("configure");
    } finally {
      setIsTraining(false);
    }
  }, [file, config]);

  const handlePredict = useCallback(
    async (features: number[]): Promise<number[] | null> => {
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.prediction;
      } catch {
        return null;
      }
    },
    []
  );

  const featureColumns = preview
    ? preview.columns.filter((c) => c !== config.target)
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Workflow Progress */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                ML Workspace
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Upload data, configure, train, and predict
              </p>
            </div>
            <WorkflowSteps currentStep={step} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Upload & Config */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <UploadPanel
                file={file}
                preview={preview}
                onFileSelect={handleFileSelect}
                onClear={handleClearFile}
              />

              {preview && (
                <ConfigPanel
                  columns={preview.columns}
                  config={config}
                  onConfigChange={setConfig}
                  onTrain={handleTrain}
                  isTraining={isTraining}
                />
              )}
            </div>

            {/* Right Column - Results */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {!trainResult && !isTraining && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/30 px-8 py-20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                    <svg
                      className="h-6 w-6 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                      />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    No results yet
                  </p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Upload a CSV dataset and train a model to see evaluation
                    metrics and predictions here.
                  </p>
                </div>
              )}

              {isTraining && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-border bg-card/50 px-8 py-20">
                  <div className="relative">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" />
                  </div>
                  <p className="mt-6 text-sm font-medium text-foreground">
                    Training model...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Running {config.model === "linear_regression" ? "Linear Regression" : "KNN"} on your dataset
                  </p>
                </div>
              )}

              {trainResult && !isTraining && (
                <>
                  <MetricsPanel metrics={trainResult.metrics} />

                  {chartData.length > 0 && (
                    <ResultsChart data={chartData} />
                  )}

                  {featureColumns.length > 0 && (
                    <PredictPanel
                      featureColumns={featureColumns}
                      onPredict={handlePredict}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
