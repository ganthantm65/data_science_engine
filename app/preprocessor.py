import pandas as pd

class Preprocessor:

    def __init__(self):
        self.min = None
        self.max = None
        self.numeric_columns = None

    def clean(self, df):

        # Fill missing numeric values
        numeric = df.select_dtypes(include=["number"])
        numeric = numeric.fillna(numeric.mean())

        # Fill missing categorical values
        categorical = df.select_dtypes(exclude=["number"])
        categorical = categorical.fillna("Unknown")

        # One-hot encode categorical columns
        categorical = pd.get_dummies(categorical)

        # Combine both
        return pd.concat([numeric, categorical], axis=1)

    def scale(self, X):

        self.min = X.min(axis=0)
        self.max = X.max(axis=0)

        return (X - self.min) / (self.max - self.min + 1e-8)

    def transform(self, X):

        return (X - self.min) / (self.max - self.min + 1e-8)