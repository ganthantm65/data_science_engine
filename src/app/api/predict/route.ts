import { NextResponse } from "next/server";
import {
  applyScale,
  predictLinearRegression,
  predictKNN,
} from "@/lib/ml-engine";

export async function POST(request: Request) {
  try {
    const { features } = (await request.json()) as { features: number[] };

    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: "Missing features array" },
        { status: 400 }
      );
    }

    const model = globalThis.__mlModel;
    if (!model) {
      return NextResponse.json(
        { error: "No model trained yet. Please train a model first." },
        { status: 400 }
      );
    }

    // Scale input
    const scaledInput = applyScale([features], model.scaler);

    let prediction: number[];

    if (model.type === "linear_regression" && model.weights) {
      prediction = predictLinearRegression(model.weights, scaledInput);
    } else if (model.type === "knn" && model.XTrain && model.yTrain) {
      prediction = predictKNN(
        model.XTrain,
        model.yTrain,
        scaledInput,
        model.k ?? 3,
        model.problemType
      );
    } else {
      return NextResponse.json(
        { error: "Model state is invalid" },
        { status: 500 }
      );
    }

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Prediction failed" },
      { status: 500 }
    );
  }
}
