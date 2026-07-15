import pandas as pd

class Preprocessor:

    def __init__(self):
        self.min = None
        self.max = None

    def clean(self, df):

        # Numeric columns
        numeric = df.select_dtypes(include=["number"]).copy()
        numeric = numeric.fillna(numeric.mean())

        # Categorical columns
        categorical = df.select_dtypes(exclude=["number"]).copy()
        categorical = categorical.fillna("Unknown")

        if not categorical.empty:
            categorical = pd.get_dummies(categorical)

        if numeric.empty:
            return categorical

        if categorical.empty:
            return numeric

        return pd.concat([numeric, categorical], axis=1)

    def scale(self, X):

        self.min = X.min(axis=0)
        self.max = X.max(axis=0)

        return (X - self.min) / (self.max - self.min + 1e-8)

    def transform(self, X):

        return (X - self.min) / (self.max - self.min + 1e-8)