from .preprocessor import Preprocessor
from .model_factory import ModelFactory
from .evaluator import Evaluator
from .visualizer import Visualizer
import numpy as np
import pandas as pd


class DSEngine:

    def __init__(self, model_name, problem_type):
        self.problem_type = problem_type
        self.preprocessor = Preprocessor()
        self.model = ModelFactory.create(model_name, problem_type)

    def train(self, df, target):

        # Remove spaces from column names
        df.columns = df.columns.str.strip()
        target = target.strip()

        if target not in df.columns:
            raise ValueError(
                f"Target column '{target}' not found.\nAvailable columns: {df.columns.tolist()}"
            )

        # Save target separately
        y = df[target]

        # Remove target from features
        X = df.drop(columns=[target])

        # Preprocess features
        X = self.preprocessor.clean(X)

        # Convert target to numeric
        y = pd.to_numeric(y, errors="raise")

        # Convert to numpy
        X = X.values
        y = y.values

        # Scale features
        X = self.preprocessor.scale(X)

        # Train-test split
        split = int(0.8 * len(X))

        X_train = X[:split]
        X_test = X[split:]

        y_train = y[:split]
        y_test = y[split:]

        # Train model
        self.model.fit(X_train, y_train)

        # Predict
        predictions = self.model.predict(X_test)

        # Evaluate
        metrics = Evaluator.evaluate(
            y_test,
            predictions,
            self.problem_type
        )

        # Plot
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