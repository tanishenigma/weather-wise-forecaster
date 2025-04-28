
export const weatherConditions = {
  0: "Cloudy",
  1: "Rainy",
  2: "Snowy",
  3: "Thunderstorm",
  4: "Foggy",
  5: "Drizzle",
  6: "Overcast",
  7: "Windy",
  8: "Partly Cloudy",
  9: "Sunny",
  10: "Hot",
  11: "Cold",
  12: "Humid",
  13: "Dry",
  14: "Stormy",
  15: "Dusty",
  16: "Freezing",
  17: "Mild",
  18: "Windstorm",
  19: "Blizzard",
  20: "Heavy Rain",
  21: "Light Rain",
  22: "Hurricane"
} as const;

export type WeatherCondition = keyof typeof weatherConditions;

export const getWeatherCondition = (prediction: number | string): string => {
  const numPrediction = Number(prediction);
  return weatherConditions[numPrediction as WeatherCondition] || "Unknown";
};
