
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, CloudRain, Gauge, Cloud } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WeatherFormProps {
  onPredict: (formData: WeatherFeatures) => void;
  isLoading: boolean;
}

export interface WeatherFeatures {
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  pressure: number;
  cloud_cover: number;
}

const WeatherForm: React.FC<WeatherFormProps> = ({ onPredict, isLoading }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<WeatherFeatures>({
    temperature: 25.0,
    humidity: 65.0,
    wind_speed: 10.0,
    precipitation: 0.0,
    pressure: 1013.0,
    cloud_cover: 30.0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.humidity < 0 || formData.humidity > 100) {
      toast({
        title: "Invalid Input",
        description: "Humidity must be between 0 and 100%",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.cloud_cover < 0 || formData.cloud_cover > 100) {
      toast({
        title: "Invalid Input",
        description: "Cloud cover must be between 0 and 100%",
        variant: "destructive"
      });
      return;
    }
    
    onPredict(formData);
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Weather Prediction</CardTitle>
        <CardDescription>
          Enter weather parameters to get a prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" /> Temperature (°C)
              </Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="humidity" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" /> Humidity (%)
              </Label>
              <Input
                id="humidity"
                name="humidity"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wind_speed" className="flex items-center gap-2">
                <Wind className="h-4 w-4" /> Wind Speed (km/h)
              </Label>
              <Input
                id="wind_speed"
                name="wind_speed"
                type="number"
                step="0.1"
                min="0"
                value={formData.wind_speed}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precipitation" className="flex items-center gap-2">
                <CloudRain className="h-4 w-4" /> Precipitation (mm)
              </Label>
              <Input
                id="precipitation"
                name="precipitation"
                type="number"
                step="0.1"
                min="0"
                value={formData.precipitation}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pressure" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" /> Pressure (hPa)
              </Label>
              <Input
                id="pressure"
                name="pressure"
                type="number"
                step="0.1"
                value={formData.pressure}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cloud_cover" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" /> Cloud Cover (%)
              </Label>
              <Input
                id="cloud_cover"
                name="cloud_cover"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.cloud_cover}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Predict Weather"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeatherForm;
