from .models import LinearRegressionModel,KNN
class ModelFactory:

    @staticmethod
    def create(model_name, problem_type="regression"):

        if model_name == "linear_regression":
            return LinearRegressionModel()

        elif model_name == "knn":
            return KNN(3, problem_type)

        else:
            raise ValueError("Unsupported model")
