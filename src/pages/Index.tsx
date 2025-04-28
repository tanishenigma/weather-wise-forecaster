
import { useState } from 'react';
import WeatherForm, { WeatherFeatures } from '@/components/WeatherForm';
import PredictionResult from '@/components/PredictionResult';
import { useToast } from '@/components/ui/use-toast';
import { predictWeather, PredictionResponse } from '@/services/ApiService';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const handlePredict = async (formData: WeatherFeatures) => {
    setIsLoading(true);
    try {
      const result = await predictWeather(formData);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Error",
        description: error instanceof Error ? error.message : "Failed to get prediction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-blue-800 dark:text-blue-300 mb-2">Weather Wise Forecaster</h1>
          <p className="text-slate-600 dark:text-slate-400">Use machine learning to predict weather conditions</p>
        </header>
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <WeatherForm onPredict={handlePredict} isLoading={isLoading} />
          
          {prediction && (
            <PredictionResult 
              prediction={prediction.prediction.toString()} 
              probabilities={prediction.probabilities} 
            />
          )}
        </div>
      </div>
      
      <footer className="mt-10 p-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Weather Wise Forecaster &copy; 2025 | Powered by Machine Learning</p>
        <p className="mt-1">Place the model.pkl file in the src/backend directory to use your trained model</p>
      </footer>
    </div>
  );
};

export default Index;
