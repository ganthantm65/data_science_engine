export type ModelType = "linear_regression" | "knn";
export type ProblemType = "regression" | "classification";

export interface TrainResponse {
  message: string;
  metrics: RegressionMetrics | ClassificationMetrics;
  plot_image_endpoint: string;
  columns: string[];
  featureCount: number;
}

export interface RegressionMetrics {
  type: "regression";
  mse: number;
  mae: number;
}

export interface ClassificationMetrics {
  type: "classification";
  accuracy: number;
}

export interface PredictionResponse {
  prediction: number[];
}

export interface DatasetPreview {
  columns: string[];
  rows: Record<string, string | number>[];
  rowCount: number;
}

export interface TrainConfig {
  model: ModelType;
  target: string;
  problemType: ProblemType;
}

export interface ChartDataPoint {
  index: number;
  actual: number;
  predicted: number;
}
