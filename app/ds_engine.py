from .preprocessor import Preprocessor
from .model_factory import ModelFactory
from .evaluator import Evaluator
from .visualizer import Visualizer
import numpy as np


class DSEngine:

    def __init__(self, model_name, problem_type):

        self.problem_type = problem_type
        self.preprocessor = Preprocessor()
        self.model = ModelFactory.create(model_name, problem_type)

    def train(self, df, target):

        # Check target exists
        if target not in df.columns:
            raise ValueError(
                f"Target column '{target}' not found.\nAvailable columns: {list(df.columns)}"
            )

        # Separate target BEFORE preprocessing
        y = df[target]

        # Features only
        X = df.drop(columns=[target])

        # Clean features
        X = self.preprocessor.clean(X)

        # Scale features
        X = self.preprocessor.scale(X.values)

        y = y.values

        split = int(0.8 * len(X))

        X_train = X[:split]
        X_test = X[split:]

        y_train = y[:split]
        y_test = y[split:]

        self.model.fit(X_train, y_train)

        predictions = self.model.predict(X_test)

        metrics = Evaluator.evaluate(
            y_test,
            predictions,
            self.problem_type
        )

        plot_path = Visualizer.plot_predictions(
            y_test,
            predictions
        )

        return metrics, plot_path

    def predict(self, input_features):

        input_array = np.array(input_features).reshape(1, -1)

        input_scaled = self.preprocessor.transform(input_array)

        prediction = self.model.predict(input_scaled)

        return prediction.tolist()