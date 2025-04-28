
# Weather Wise Forecaster

A web application that uses machine learning to predict weather conditions based on environmental parameters.

## Project Structure

- `/src/backend`: FastAPI backend that serves the ML model
- `/src`: React frontend with components and services

## Setup and Running

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd src/backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Place your trained model file as `model.pkl` in the backend directory.

4. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

The backend will be available at http://localhost:8000, and interactive API documentation at http://localhost:8000/docs.

### Frontend Setup

1. Install Node.js dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:8080.

## Using the Application

1. Enter weather parameters in the form (temperature, humidity, wind speed, etc.)
2. Click "Predict Weather" to get the prediction
3. View the prediction result and probabilities (if available)

## Machine Learning Model

The application uses a trained RandomForestClassifier model (stored in `model.pkl`) to make predictions.

Input features expected by the model:
- Temperature (°C)
- Humidity (%)
- Wind Speed (km/h)
- Precipitation (mm)
- Pressure (hPa)
- Cloud Cover (%)

If your model requires different features, modify the `WeatherFeatures` class in both frontend and backend code.
