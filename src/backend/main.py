
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List, Union, Optional
import os
import random

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

class SimulationRequest(BaseModel):
    samples: int = 5
    season: str = "summer"
    
    class Config:
        schema_extra = {
            "example": {
                "samples": 5,
                "season": "summer"
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

@app.post("/simulate")
def simulate_weather(request: SimulationRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        samples = request.samples
        if samples <= 0 or samples > 50:
            samples = 5  # Default to 5 if out of range
        
        # Generate synthetic data based on season
        synthetic_data = []
        
        # Season-specific parameter ranges
        season_params = {
            "summer": {
                "temp": (20, 35),
                "dwpt": (15, 25),
                "rhum": (40, 80),
                "prcp": (0, 5),
                "snow": (0, 0),
                "wspd": (5, 20)
            },
            "winter": {
                "temp": (-10, 10),
                "dwpt": (-15, 5),
                "rhum": (60, 90),
                "prcp": (0, 3),
                "snow": (0, 10),
                "wspd": (10, 30)
            },
            "spring": {
                "temp": (10, 25),
                "dwpt": (5, 18),
                "rhum": (50, 85),
                "prcp": (0, 8),
                "snow": (0, 2),
                "wspd": (8, 25)
            },
            "autumn": {
                "temp": (5, 20),
                "dwpt": (0, 15),
                "rhum": (55, 90),
                "prcp": (0, 10),
                "snow": (0, 5),
                "wspd": (10, 30)
            }
        }
        
        # Default to summer if invalid season
        season = request.season.lower()
        if season not in season_params:
            season = "summer"
        
        params = season_params[season]
        
        for _ in range(samples):
            # Generate random weather parameters within season-specific ranges
            temp = random.uniform(params["temp"][0], params["temp"][1])
            dwpt = random.uniform(params["dwpt"][0], min(params["dwpt"][1], temp))  # Dew point should be <= temp
            rhum = random.uniform(params["rhum"][0], params["rhum"][1])
            prcp = random.uniform(params["prcp"][0], params["prcp"][1]) * (0.3 if random.random() < 0.7 else 1)  # 70% chance of less precipitation
            snow = random.uniform(params["snow"][0], params["snow"][1]) * (0.2 if random.random() < 0.8 else 1)  # 80% chance of less snow
            wdir = random.uniform(0, 360)
            wspd = random.uniform(params["wspd"][0], params["wspd"][1])
            wpgt = wspd + random.uniform(0, 10)  # Wind gust is slightly higher than wind speed
            pres = random.uniform(990, 1030)
            hour = random.randint(0, 23)
            day_of_week = random.randint(0, 6)
            
            features = [temp, dwpt, rhum, prcp, snow, wdir, wspd, wpgt, pres, hour, day_of_week]
            
            # Make prediction
            input_data = np.array([features])
            prediction = model.predict(input_data)[0]
            
            # Get prediction probabilities
            prediction_proba = {}
            if hasattr(model, 'classes_'):
                proba = model.predict_proba(input_data)[0]
                prediction_proba = {str(model.classes_[i]): float(proba[i]) 
                                for i in range(len(model.classes_))}
            
            # Create result object
            weather_data = {
                "temp": round(temp, 1),
                "dwpt": round(dwpt, 1),
                "rhum": round(rhum, 1),
                "prcp": round(prcp, 2),
                "snow": round(snow, 2),
                "wdir": round(wdir, 1),
                "wspd": round(wspd, 1),
                "wpgt": round(wpgt, 1),
                "pres": round(pres, 1),
                "hour": hour,
                "day_of_week": day_of_week,
                "prediction": str(prediction),
                "probabilities": prediction_proba
            }
            
            synthetic_data.append(weather_data)
        
        return {"simulations": synthetic_data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
