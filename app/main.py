from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware as CORS
import pandas as pd
import os
import uvicorn
import shutil

from app.ds_engine import DSEngine

MAX_FILE_SIZE = 100 * 1024 * 1024 

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
    problem_type: str = Form(...)
):
    os.makedirs("uploads", exist_ok=True)

    filepath = os.path.join("uploads", file.filename)

    size = 0

    with open(filepath, "wb") as buffer:
        while chunk := file.file.read(1024 * 1024):  # 1 MB chunks
            size += len(chunk)

            if size > MAX_FILE_SIZE:
                buffer.close()
                os.remove(filepath)
                raise HTTPException(
                    status_code=413,
                    detail="Maximum upload size is 100 MB."
                )

            buffer.write(chunk)

    try:
        try:
            df = pd.read_csv(filepath, encoding="utf-8")
        except UnicodeDecodeError:
            try:
                df = pd.read_csv(filepath, encoding="utf-8-sig")
            except UnicodeDecodeError:
                df = pd.read_csv(filepath, encoding="latin1")

        engine = DSEngine(model, problem_type)
        metrics, plot_path = engine.train(df, target)

        app.state.engine = engine

        return {
            "message": "Model trained successfully",
            "metrics": metrics,
            "plot_image_endpoint": "/plot"
        }

    except Exception as e:
        import traceback
        traceback.print_exc()   # Prints the full error in Render logs
        raise HTTPException(
            status_code=500,
            detail=f"Training failed: {str(e)}"
        )

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