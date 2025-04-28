
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List, Union
import os

app = FastAPI(title="Weather Prediction API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Update the input model to match all 11 features
class WeatherFeatures(BaseModel):
    temp: float
    dwpt: float
    rhum: float
    prcp: float
    snow: float
    wdir: float
    wspd: float
    wpgt: float
    pres: float
    hour: int
    day_of_week: int
    
    class Config:
        schema_extra = {
            "example": {
                "temp": 20.0,
                "dwpt": 15.0,
                "rhum": 65.0,
                "prcp": 0.0,
                "snow": 0.0,
                "wdir": 180.0,
                "wspd": 10.0,
                "wpgt": 15.0,
                "pres": 1013.0,
                "hour": 14,
                "day_of_week": 2
            }
        }

# Load the model
model_path = os.path.join(os.path.dirname(__file__), "weather_model.pkl")
try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.get("/")
def read_root():
    return {"message": "Weather Prediction API is running"}

@app.post("/predict")
def predict(features: WeatherFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Extract features in the correct order
        feature_values = [
            features.temp,
            features.dwpt,
            features.rhum,
            features.prcp,
            features.snow,
            features.wdir,
            features.wspd,
            features.wpgt,
            features.pres,
            features.hour,
            features.day_of_week
        ]
        
        # Make prediction
        input_data = np.array([feature_values])
        prediction = model.predict(input_data)[0]
        
        # Check if model is classification or regression
        if hasattr(model, 'classes_'):
            # Classification model
            prediction_proba = model.predict_proba(input_data)[0]
            probabilities = {str(model.classes_[i]): float(prediction_proba[i]) 
                          for i in range(len(model.classes_))}
            return {
                "prediction": str(prediction),
                "probabilities": probabilities
            }
        else:
            # Regression model
            return {"prediction": float(prediction)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
