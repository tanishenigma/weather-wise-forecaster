
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { simulateWeather, SimulationRequest, SimulationResponse } from '@/services/ApiService';
import { Umbrella, Loader2 } from 'lucide-react';
import SimulationResults from './SimulationResults';

const WeatherSimulation: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [simulationOptions, setSimulationOptions] = useState<SimulationRequest>({
    samples: 5,
    season: 'summer',
  });
  const [simulationResults, setSimulationResults] = useState<SimulationResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSimulationOptions((prev) => ({
      ...prev,
      [name]: name === 'samples' ? parseInt(value, 10) : value,
    }));
  };

  const handleSeasonChange = (value: string) => {
    setSimulationOptions((prev) => ({
      ...prev,
      season: value as SimulationRequest['season'],
    }));
  };

  const handleSimulate = async () => {
    try {
      setIsLoading(true);
      
      // Validate samples
      if (simulationOptions.samples <= 0 || simulationOptions.samples > 50) {
        toast({
          title: "Invalid Input",
          description: "Number of samples must be between 1 and 50",
          variant: "destructive",
        });
        return;
      }
      
      const results = await simulateWeather(simulationOptions);
      setSimulationResults(results);
      
      toast({
        title: "Simulation Complete",
        description: `Generated ${results.simulations.length} weather scenarios`,
        variant: "default",
      });
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Error",
        description: error instanceof Error ? error.message : "Failed to simulate weather data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Umbrella className="h-5 w-5 text-blue-500" />
            Weather Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="samples">Number of Samples (1-50)</Label>
                <Input
                  id="samples"
                  name="samples"
                  type="number"
                  min="1"
                  max="50"
                  value={simulationOptions.samples}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select
                  value={simulationOptions.season}
                  onValueChange={handleSeasonChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="spring">Spring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleSimulate} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Simulating...
                </>
              ) : (
                'Generate Weather Simulations'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {simulationResults && (
        <SimulationResults results={simulationResults} />
      )}
    </div>
  );
};

export default WeatherSimulation;
