
import { WeatherFeatures } from '@/components/WeatherForm';

const API_URL = 'http://localhost:8000';

export interface PredictionResponse {
  prediction: string | number;
  probabilities?: Record<string, number>;
}

export const predictWeather = async (features: WeatherFeatures): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
