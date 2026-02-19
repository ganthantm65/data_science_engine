import matplotlib.pyplot as plt
import os

class Visualizer:

    @staticmethod
    def plot_predictions(y_true, y_pred):

        os.makedirs("plots", exist_ok=True)

        plt.figure()
        plt.scatter(range(len(y_true)), y_true)
        plt.scatter(range(len(y_pred)), y_pred)
        plt.title("Actual vs Predicted")
        plt.xlabel("Index")
        plt.ylabel("Value")

        filepath = "plots/result.png"
        plt.savefig(filepath)
        plt.close()

        return filepath
