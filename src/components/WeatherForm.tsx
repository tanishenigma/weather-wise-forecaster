
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, CloudRain, Gauge, Snow, Compass, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface WeatherFeatures {
  temp: number;
  dwpt: number;
  rhum: number;
  prcp: number;
  snow: number;
  wdir: number;
  wspd: number;
  wpgt: number;
  pres: number;
  hour: number;
  day_of_week: number;
}

interface WeatherFormProps {
  onPredict: (formData: WeatherFeatures) => void;
  isLoading: boolean;
}

const WeatherForm: React.FC<WeatherFormProps> = ({ onPredict, isLoading }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<WeatherFeatures>({
    temp: 20.0,
    dwpt: 15.0,
    rhum: 65.0,
    prcp: 0.0,
    snow: 0.0,
    wdir: 180,
    wspd: 10.0,
    wpgt: 15.0,
    pres: 1013.0,
    hour: new Date().getHours(),
    day_of_week: new Date().getDay()
  });

  useEffect(() => {
    // Update time-based fields every minute
    const interval = setInterval(() => {
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        hour: now.getHours(),
        day_of_week: now.getDay()
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
    if (formData.rhum < 0 || formData.rhum > 100) {
      toast({
        title: "Invalid Input",
        description: "Humidity must be between 0 and 100%",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.wdir < 0 || formData.wdir > 360) {
      toast({
        title: "Invalid Input",
        description: "Wind direction must be between 0 and 360 degrees",
        variant: "destructive"
      });
      return;
    }
    
    onPredict(formData);
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Weather Parameters</CardTitle>
        <CardDescription>
          Enter weather parameters to get a prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temp" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" /> Temperature (°C)
              </Label>
              <Input
                id="temp"
                name="temp"
                type="number"
                step="0.1"
                value={formData.temp}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dwpt" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" /> Dew Point (°C)
              </Label>
              <Input
                id="dwpt"
                name="dwpt"
                type="number"
                step="0.1"
                value={formData.dwpt}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rhum" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" /> Humidity (%)
              </Label>
              <Input
                id="rhum"
                name="rhum"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.rhum}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prcp" className="flex items-center gap-2">
                <CloudRain className="h-4 w-4" /> Precipitation (mm)
              </Label>
              <Input
                id="prcp"
                name="prcp"
                type="number"
                step="0.1"
                min="0"
                value={formData.prcp}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="snow" className="flex items-center gap-2">
                <Snow className="h-4 w-4" /> Snowfall (mm)
              </Label>
              <Input
                id="snow"
                name="snow"
                type="number"
                step="0.1"
                min="0"
                value={formData.snow}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wdir" className="flex items-center gap-2">
                <Compass className="h-4 w-4" /> Wind Direction (°)
              </Label>
              <Input
                id="wdir"
                name="wdir"
                type="number"
                step="1"
                min="0"
                max="360"
                value={formData.wdir}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wspd" className="flex items-center gap-2">
                <Wind className="h-4 w-4" /> Wind Speed (km/h)
              </Label>
              <Input
                id="wspd"
                name="wspd"
                type="number"
                step="0.1"
                min="0"
                value={formData.wspd}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wpgt" className="flex items-center gap-2">
                <Wind className="h-4 w-4" /> Wind Gust (km/h)
              </Label>
              <Input
                id="wpgt"
                name="wpgt"
                type="number"
                step="0.1"
                min="0"
                value={formData.wpgt}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pres" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" /> Pressure (hPa)
              </Label>
              <Input
                id="pres"
                name="pres"
                type="number"
                step="0.1"
                value={formData.pres}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hour" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Hour (0-23)
              </Label>
              <Input
                id="hour"
                name="hour"
                type="number"
                min="0"
                max="23"
                value={formData.hour}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="day_of_week" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Day of Week (0-6)
              </Label>
              <Input
                id="day_of_week"
                name="day_of_week"
                type="number"
                min="0"
                max="6"
                value={formData.day_of_week}
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
