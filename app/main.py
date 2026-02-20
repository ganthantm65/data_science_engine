from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware as CORS
import pandas as pd
import os
import uvicorn
import shutil

from app.ds_engine import DSEngine

os.makedirs("uploads", exist_ok=True)
os.makedirs("plots", exist_ok=True)

app = FastAPI()
app.state.engine = None

app.add_middleware(
    CORS,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

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
    plot_path = "plots/result.png"
    if not os.path.exists(plot_path):
        return {"error": "Plot not found. Train model first."}
    return FileResponse(plot_path)

class FeatureInput(BaseModel):
    features: List[float]


@app.post("/predict")
async def predict(data: FeatureInput):
    if not app.state.engine:
        return {"error": "Train model first"}

    prediction = app.state.engine.predict(data.features)

    return {"prediction": prediction}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)