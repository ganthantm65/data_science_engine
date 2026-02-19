import numpy as np

class LinearRegressionModel:
    def __init__(self):
        self.weights = None

    def fit(self, X, y):
        X = np.array(X)
        y = np.array(y)

        ones = np.ones((X.shape[0], 1))
        X = np.hstack((ones, X))

        self.weights = np.linalg.pinv(X) @ y

    def predict(self, X):
        X = np.array(X)

        if X.ndim == 1:
            X = X.reshape(1, -1)

        ones = np.ones((X.shape[0], 1))
        X = np.hstack((ones, X))

        return X @ self.weights
