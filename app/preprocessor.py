class Preprocessor:

    def __init__(self):
        self.min = None
        self.max = None

    def clean(self, df):
        return df.fillna(df.mean(numeric_only=True))

    def scale(self, X):
        self.min = X.min(axis=0)
        self.max = X.max(axis=0)
        return (X - self.min) / (self.max - self.min + 1e-8)

    def transform(self, X):
        return (X - self.min) / (self.max - self.min + 1e-8)
