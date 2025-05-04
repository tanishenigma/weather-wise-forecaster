
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimulationResponse } from '@/services/ApiService';
import { getWeatherCondition } from '../utils/weatherConditions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PredictionResult from './PredictionResult';
import { Thermometer, CloudRain, Wind, Gauge } from 'lucide-react';

interface SimulationResultsProps {
  results: SimulationResponse;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ results }) => {
  const [selectedSimulation, setSelectedSimulation] = useState<number | null>(null);
  
  if (!results || !results.simulations || results.simulations.length === 0) {
    return null;
  }

  const simulation = selectedSimulation !== null ? results.simulations[selectedSimulation] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="detail">Detailed View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead><Thermometer className="h-4 w-4 inline mr-1" /> Temp (°C)</TableHead>
                    <TableHead><CloudRain className="h-4 w-4 inline mr-1" /> Precip (mm)</TableHead>
                    <TableHead><Wind className="h-4 w-4 inline mr-1" /> Wind (km/h)</TableHead>
                    <TableHead><Gauge className="h-4 w-4 inline mr-1" /> Pressure</TableHead>
                    <TableHead>Weather Condition</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.simulations.map((sim, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{sim.temp}°C</TableCell>
                      <TableCell>{sim.prcp} mm</TableCell>
                      <TableCell>{sim.wspd} km/h</TableCell>
                      <TableCell>{sim.pres} hPa</TableCell>
                      <TableCell>{getWeatherCondition(sim.prediction)}</TableCell>
                      <TableCell>
                        <button 
                          onClick={() => setSelectedSimulation(index)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Details
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="detail">
            {selectedSimulation !== null ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Thermometer className="h-4 w-4 mr-2" /> Temperature
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{simulation?.temp}°C</div>
                      <div className="text-xs text-muted-foreground">Dew Point: {simulation?.dwpt}°C</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <CloudRain className="h-4 w-4 mr-2" /> Precipitation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{simulation?.prcp} mm</div>
                      <div className="text-xs text-muted-foreground">Snow: {simulation?.snow} mm</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Wind className="h-4 w-4 mr-2" /> Wind
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{simulation?.wspd} km/h</div>
                      <div className="text-xs text-muted-foreground">Gusts: {simulation?.wpgt} km/h</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Gauge className="h-4 w-4 mr-2" /> Pressure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{simulation?.pres} hPa</div>
                      <div className="text-xs text-muted-foreground">
                        Humidity: {simulation?.rhum}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <PredictionResult 
                  prediction={simulation?.prediction.toString() || ''}
                  probabilities={simulation?.probabilities}
                />
                
                <button 
                  onClick={() => setSelectedSimulation(null)}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ← Back to results
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Select a simulation from the table view to see details</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SimulationResults;
