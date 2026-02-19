from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import pandas as pd
import os
import shutil

from app.ds_engine import DSEngine

app = FastAPI()
app.state.engine = None


@app.post("/train")
async def train(
    file: UploadFile = File(...),
    model: str = Form(...),
    target: str = Form(...),
    problem_type: str = Form(...)          # added
):
    os.makedirs("uploads", exist_ok=True)
    filepath = f"uploads/{file.filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    df = pd.read_csv(filepath)

    engine = DSEngine(model, problem_type)   # ✅ now correct
    metrics, plot_path = engine.train(df, target)

    app.state.engine = engine

    return {
        "message": "Model trained successfully",
        "metrics": metrics,
        "plot_image_endpoint": "/plot"
    }

@app.get("/plot")
def get_plot():
    return FileResponse("plots/result.png")


class FeatureInput(BaseModel):
    features: List[float]


@app.post("/predict")
async def predict(data: FeatureInput):
    if not app.state.engine:
        return {"error": "Train model first"}

    prediction = app.state.engine.predict(data.features)

    return {"prediction": prediction}
