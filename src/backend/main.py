
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

# Define the input model based on expected features
class WeatherFeatures(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    precipitation: float
    pressure: float
    cloud_cover: float
    
    class Config:
        schema_extra = {
            "example": {
                "temperature": 25.0,
                "humidity": 65.0,
                "wind_speed": 10.0,
                "precipitation": 0.0,
                "pressure": 1013.0,
                "cloud_cover": 30.0
            }
        }

# Load the model
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from {model_path}")
    # You can optionally print model features here
    # if hasattr(model, 'feature_names_in_'):
    #     print(f"Model features: {model.feature_names_in_}")
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
        # Extract features in the order expected by the model
        feature_values = [
            features.temperature,
            features.humidity,
            features.wind_speed,
            features.precipitation,
            features.pressure,
            features.cloud_cover
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
