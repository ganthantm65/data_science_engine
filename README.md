# 🚀 Machine Learning API Engine

A modular Machine Learning API built using FastAPI that supports both
**Regression** and **Classification** using custom-built algorithms.

------------------------------------------------------------------------

## 📌 Project Overview

This project implements a mini ML framework with:

-   Custom Linear Regression (Normal Equation with pseudo-inverse)
-   Custom K-Nearest Neighbors (KNN)
-   Data Preprocessing (Cleaning + MinMax Scaling)
-   Evaluation Metrics
-   Visualization
-   REST API using FastAPI

------------------------------------------------------------------------

## 🏗 Architecture

    app/
    │
    ├── main.py
    ├── ds_engine.py
    ├── preprocessor.py
    ├── model_factory.py
    ├── evaluator.py
    ├── visualizer.py
    └── models/
        ├── linear_regression.py
        └── knn.py

------------------------------------------------------------------------

## ⚙️ Features

-   Supports Regression & Classification
-   Custom ML algorithms (No sklearn models used internally)
-   Automatic scaling
-   Metric calculation
-   Prediction visualization
-   Swagger UI integration

------------------------------------------------------------------------

## 📊 Supported Models

### 1️⃣ Linear Regression

-   Uses Normal Equation
-   Safe pseudo-inverse (pinv)
-   For regression tasks

### 2️⃣ KNN

-   Classification (majority vote)
-   Regression (mean of neighbors)
-   Configurable `k` value

------------------------------------------------------------------------

## 📁 Example Dataset (Regression)

**House Price Dataset**

Columns: - area - bedrooms - bathrooms - age - price (target)

------------------------------------------------------------------------

## 📁 Example Dataset (Classification)

**Student Performance Dataset**

Columns: - hours_studied - attendance_percent - assignments_completed -
sleep_hours - result (0 = Fail, 1 = Pass)

------------------------------------------------------------------------

## 🚀 API Endpoints

### 🔹 Train Model

**POST** `/train`

Form Data: - file (CSV) - model (linear_regression / knn) - target
(column name) - problem_type (regression / classification)

------------------------------------------------------------------------

### 🔹 Predict

**POST** `/predict`

Body (JSON):

    [1500, 4, 3, 5]

Returns:

    [315000.45]

------------------------------------------------------------------------

### 🔹 View Plot

**GET** `/plot`

Returns prediction visualization image.

------------------------------------------------------------------------

## 🛠 How to Run

1.  Install dependencies

```{=html}
<!-- -->
```
    pip install fastapi uvicorn pandas numpy matplotlib python-multipart

2.  Start server

```{=html}
<!-- -->
```
    uvicorn app.main:app --reload

3.  Open Swagger UI

```{=html}
<!-- -->
```
    http://127.0.0.1:8000/docs

------------------------------------------------------------------------

## 🧠 Evaluation Metrics

### Classification

-   Accuracy

### Regression

-   Mean Squared Error (MSE)
-   Mean Absolute Error (MAE)

------------------------------------------------------------------------

## 📌 Improvements Implemented

-   Removed incorrect automatic task detection
-   Added explicit problem_type handling
-   Fixed singular matrix issue in Linear Regression
-   Added support for regression in KNN
-   Improved API validation
-   Structured modular architecture

------------------------------------------------------------------------

## 🎯 Future Improvements

-   Add Random Forest
-   Add Model Persistence (save/load)
-   Add Cross Validation
-   Add Docker Support
-   Add Deployment Guide

------------------------------------------------------------------------

## 📜 License

This project is for educational and learning purposes.
