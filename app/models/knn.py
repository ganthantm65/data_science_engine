import numpy as np

class KNN:
    def __init__(self, k=3, problem_type="classification"):
        self.k = k
        self.problem_type = problem_type

    def fit(self, X, y):
        self.X = np.array(X)
        self.y = np.array(y)

    def predict(self, X_test):
        predictions = []

        for x in X_test:
            distances = np.sqrt(np.sum((self.X - x)**2, axis=1))
            k_indices = np.argsort(distances)[:self.k]
            k_labels = self.y[k_indices]

            if self.problem_type == "classification":
                values, counts = np.unique(k_labels, return_counts=True)
                predictions.append(values[np.argmax(counts)])
            else:
                predictions.append(np.mean(k_labels))

        return np.array(predictions)
