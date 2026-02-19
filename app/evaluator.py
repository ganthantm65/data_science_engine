import numpy as np

class Evaluator:

    @staticmethod
    def evaluate(y_true, y_pred, problem_type):

        if problem_type == "classification":
            accuracy = np.mean(y_true == y_pred)
            return {
                "type": "classification",
                "accuracy": float(accuracy)
            }

        mse = np.mean((y_true - y_pred) ** 2)
        mae = np.mean(np.abs(y_true - y_pred))

        return {
            "type": "regression",
            "mse": float(mse),
            "mae": float(mae)
        }
