/**
 * TypeScript implementation of the Python ML Engine.
 * Mirrors: LinearRegression (Normal Equation), KNN, MinMax scaling, and evaluation.
 */

// ─── Preprocessing ────────────────────────────────────────────────

export function cleanData(
  data: number[][],
  colCount: number
): number[][] {
  // Fill NaN with column mean
  const means = Array.from({ length: colCount }, (_, ci) => {
    const valid = data.map((r) => r[ci]).filter((v) => !isNaN(v));
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  });
  return data.map((row) =>
    row.map((v, ci) => (isNaN(v) ? means[ci] : v))
  );
}

export interface Scaler {
  min: number[];
  max: number[];
}

export function fitScaler(X: number[][]): Scaler {
  const cols = X[0].length;
  const min = Array(cols).fill(Infinity);
  const max = Array(cols).fill(-Infinity);
  for (const row of X) {
    for (let j = 0; j < cols; j++) {
      if (row[j] < min[j]) min[j] = row[j];
      if (row[j] > max[j]) max[j] = row[j];
    }
  }
  return { min, max };
}

export function applyScale(X: number[][], scaler: Scaler): number[][] {
  return X.map((row) =>
    row.map((v, j) => (v - scaler.min[j]) / (scaler.max[j] - scaler.min[j] + 1e-8))
  );
}

// ─── Linear Regression (Normal Equation with pseudo-inverse) ──────

function transpose(M: number[][]): number[][] {
  const rows = M.length,
    cols = M[0].length;
  const T: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) T[j][i] = M[i][j];
  return T;
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rA = A.length,
    cA = A[0].length,
    cB = B[0].length;
  const C: number[][] = Array.from({ length: rA }, () => Array(cB).fill(0));
  for (let i = 0; i < rA; i++)
    for (let j = 0; j < cB; j++)
      for (let k = 0; k < cA; k++) C[i][j] += A[i][k] * B[k][j];
  return C;
}

function matVecMul(M: number[][], v: number[]): number[] {
  return M.map((row) => row.reduce((s, val, j) => s + val * v[j], 0));
}

function invertMatrix(M: number[][]): number[][] | null {
  const n = M.length;
  const aug = M.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (Math.abs(aug[col][col]) < 1e-10) return null;

    const pivot = aug[col][col];
    for (let j = 0; j < 2 * n; j++) aug[col][j] /= pivot;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = 0; j < 2 * n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  return aug.map((row) => row.slice(n));
}

export function trainLinearRegression(X: number[][], y: number[]): number[] {
  // Add bias column (ones)
  const Xb = X.map((row) => [1, ...row]);
  const Xt = transpose(Xb);
  const XtX = matMul(Xt, Xb);
  const inv = invertMatrix(XtX);

  if (!inv) {
    // Fallback: simple pseudo-inverse approximation with regularization
    const lambda = 1e-6;
    const reg = XtX.map((row, i) =>
      row.map((v, j) => v + (i === j ? lambda : 0))
    );
    const regInv = invertMatrix(reg);
    if (!regInv) return Array(Xb[0].length).fill(0);
    const XtXinvXt = matMul(regInv, Xt);
    return matVecMul(XtXinvXt, y);
  }

  const XtXinvXt = matMul(inv, Xt);
  return matVecMul(XtXinvXt, y);
}

export function predictLinearRegression(
  weights: number[],
  X: number[][]
): number[] {
  return X.map((row) => {
    const xb = [1, ...row];
    return xb.reduce((s, v, i) => s + v * weights[i], 0);
  });
}

// ─── KNN ──────────────────────────────────────────────────────────

function euclidean(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
}

export function predictKNN(
  XTrain: number[][],
  yTrain: number[],
  XTest: number[][],
  k: number,
  problemType: "regression" | "classification"
): number[] {
  return XTest.map((testPoint) => {
    const dists = XTrain.map((trainPoint, i) => ({
      dist: euclidean(testPoint, trainPoint),
      label: yTrain[i],
    }));
    dists.sort((a, b) => a.dist - b.dist);
    const neighbors = dists.slice(0, k);

    if (problemType === "classification") {
      const counts = new Map<number, number>();
      for (const n of neighbors) {
        counts.set(n.label, (counts.get(n.label) ?? 0) + 1);
      }
      let best = neighbors[0].label,
        bestCount = 0;
      for (const [label, count] of counts) {
        if (count > bestCount) {
          best = label;
          bestCount = count;
        }
      }
      return best;
    }

    return neighbors.reduce((s, n) => s + n.label, 0) / neighbors.length;
  });
}

// ─── Evaluation ───────────────────────────────────────────────────

export function evaluateRegression(
  yTrue: number[],
  yPred: number[]
): { type: "regression"; mse: number; mae: number } {
  const n = yTrue.length;
  let mse = 0,
    mae = 0;
  for (let i = 0; i < n; i++) {
    const diff = yTrue[i] - yPred[i];
    mse += diff * diff;
    mae += Math.abs(diff);
  }
  return { type: "regression", mse: mse / n, mae: mae / n };
}

export function evaluateClassification(
  yTrue: number[],
  yPred: number[]
): { type: "classification"; accuracy: number } {
  const n = yTrue.length;
  let correct = 0;
  for (let i = 0; i < n; i++) {
    if (yTrue[i] === yPred[i]) correct++;
  }
  return { type: "classification", accuracy: correct / n };
}
