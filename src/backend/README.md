
# Weather Prediction API

This is a FastAPI backend that serves predictions from a trained machine learning model.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Place your trained model file as `model.pkl` in this directory.

3. Run the server:
   ```
   uvicorn main:app --reload
   ```

4. The API will be available at http://localhost:8000

## API Documentation

- GET `/`: Health check endpoint
- POST `/predict`: Makes predictions based on weather features
  
API documentation is available at http://localhost:8000/docs when the server is running.
