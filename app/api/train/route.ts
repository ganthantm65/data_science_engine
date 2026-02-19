import { NextResponse } from "next/server";
import {
  cleanData,
  fitScaler,
  applyScale,
  trainLinearRegression,
  predictLinearRegression,
  predictKNN,
  evaluateRegression,
  evaluateClassification,
} from "@/lib/ml-engine";
import type { Scaler } from "@/lib/ml-engine";

// In-memory model store (per-instance, works for demo)
declare global {
  // eslint-disable-next-line no-var
  var __mlModel: {
    type: "linear_regression" | "knn";
    problemType: "regression" | "classification";
    weights?: number[];
    XTrain?: number[][];
    yTrain?: number[];
    scaler: Scaler;
    k?: number;
  } | null;
}

globalThis.__mlModel = globalThis.__mlModel ?? null;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const model = formData.get("model") as string;
    const target = formData.get("target") as string;
    const problemType = formData.get("problemType") as
      | "regression"
      | "classification";

    if (!file || !model || !target || !problemType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse CSV
    const text = await file.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    const targetIndex = headers.indexOf(target);
    if (targetIndex === -1) {
      return NextResponse.json(
        { error: `Target column "${target}" not found` },
        { status: 400 }
      );
    }

    const featureIndices = headers
      .map((_, i) => i)
      .filter((i) => i !== targetIndex);

    const rawData: number[][] = [];
    const rawY: number[] = [];

    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map((v) => parseFloat(v.trim()));
      if (vals.some((v) => v === undefined)) continue;
      rawData.push(featureIndices.map((fi) => vals[fi]));
      rawY.push(vals[targetIndex]);
    }

    // Clean
    const featureCount = featureIndices.length;
    const cleaned = cleanData(rawData, featureCount);

    // Scale
    const scaler = fitScaler(cleaned);
    const scaled = applyScale(cleaned, scaler);

    // Split 80/20
    const splitIdx = Math.floor(0.8 * scaled.length);
    const XTrain = scaled.slice(0, splitIdx);
    const XTest = scaled.slice(splitIdx);
    const yTrain = rawY.slice(0, splitIdx);
    const yTest = rawY.slice(splitIdx);

    let predictions: number[];
    let metrics;

    if (model === "linear_regression") {
      const weights = trainLinearRegression(XTrain, yTrain);
      predictions = predictLinearRegression(weights, XTest);

      globalThis.__mlModel = {
        type: "linear_regression",
        problemType,
        weights,
        scaler,
      };
    } else {
      const k = 3;
      predictions = predictKNN(XTrain, yTrain, XTest, k, problemType);

      globalThis.__mlModel = {
        type: "knn",
        problemType,
        XTrain,
        yTrain,
        scaler,
        k,
      };
    }

    if (problemType === "classification") {
      metrics = evaluateClassification(yTest, predictions);
    } else {
      metrics = evaluateRegression(yTest, predictions);
    }

    // Chart data
    const chartData = yTest.map((actual, i) => ({
      index: i,
      actual,
      predicted: predictions[i],
    }));

    return NextResponse.json({
      message: "Model trained successfully",
      metrics,
      chartData,
      columns: headers,
      featureCount,
      plot_image_endpoint: "/plot",
    });
  } catch (error) {
    console.error("Training error:", error);
    return NextResponse.json(
      { error: "Training failed" },
      { status: 500 }
    );
  }
}
