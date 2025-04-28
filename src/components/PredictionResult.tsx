
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react';

interface PredictionResultProps {
  prediction: string | null;
  probabilities?: Record<string, number>;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, probabilities }) => {
  if (!prediction) return null;

  const getWeatherIcon = (predictionValue: string) => {
    const lowercasePrediction = predictionValue.toLowerCase();
    
    if (lowercasePrediction.includes('rain') || lowercasePrediction.includes('shower')) {
      return <CloudRain className="h-16 w-16 text-blue-500" />;
    } else if (lowercasePrediction.includes('cloud')) {
      return <Cloud className="h-16 w-16 text-gray-500" />;
    } else if (lowercasePrediction.includes('snow')) {
      return <CloudSnow className="h-16 w-16 text-blue-200" />;
    } else if (lowercasePrediction.includes('thunder') || lowercasePrediction.includes('storm')) {
      return <CloudLightning className="h-16 w-16 text-yellow-500" />;
    } else if (lowercasePrediction.includes('fog') || lowercasePrediction.includes('mist')) {
      return <CloudFog className="h-16 w-16 text-gray-400" />;
    } else if (lowercasePrediction.includes('drizzle')) {
      return <CloudDrizzle className="h-16 w-16 text-blue-400" />;
    } else {
      return <Sun className="h-16 w-16 text-yellow-400" />;
    }
  };

  return (
    <Card className="w-full max-w-xl mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Prediction Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          {getWeatherIcon(prediction)}
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold">{prediction}</h3>
        </div>
        
        {probabilities && Object.keys(probabilities).length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Prediction Probabilities:</h4>
              {Object.entries(probabilities)
                .sort(([, a], [, b]) => b - a)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span>{key}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-40 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.round(value * 100)}%` }} 
                        />
                      </div>
                      <span className="text-sm">{Math.round(value * 100)}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
