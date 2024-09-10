import React, { useState, useEffect } from "react";
import axios from "axios";
import DataGraph from "./components/DataGraph";
import TemperatureTable from "./components/TemperatureTable";

export interface TemperatureEntry {
  id: number;
  time: number;
  temperature: number;
}

const App: React.FC = () => {
  const [temperatureData, setTemperatureData] = useState<TemperatureEntry[]>([]);
  const [currentTemperature, setCurrentTemperature] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [temperatureSetPoint, setTemperatureSetPoint] = useState<number | null>(null);
  const getCurrentTemperature = () => currentTemperature;

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/temperature");
        const newTemperature = response.data.temperature;
        setCurrentTemperature(newTemperature);
      } catch (error) {
        console.error("Error fetching temperature:", error);
      }
    };

    fetchTemperature(); // Fetch immediately on mount
    const intervalId = setInterval(fetchTemperature, 5000); // Then every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const removeTemperatureEntry = (id: number) => {
    setTemperatureData(temperatureData.filter(entry => entry.id !== id));
  };

  const addTemperatureEntry = (entry: TemperatureEntry) => {
    setTemperatureData(prevData => [...prevData, entry]);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setResetTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <h2>Current Temperature = {currentTemperature !== null ? `${currentTemperature}°C` : 'Loading...'}</h2>
      <h2>Temperature Set Point = {temperatureSetPoint !== null ? `${temperatureSetPoint.toFixed(2)}°C` : 'N/A'}</h2>
      <h2>Current Status = {isPlaying ? 'Playing' : 'Paused'}</h2>
      <DataGraph 
        temperatureData={temperatureData} 
        isPlaying={isPlaying}
        resetTrigger={resetTrigger}
        setTemperatureSetPoint={setTemperatureSetPoint}
        getCurrentTemperature={getCurrentTemperature}
      />
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={handleReset}>Reset</button>
      <TemperatureTable
        entries={temperatureData}
        removeEntry={removeTemperatureEntry}
        addEntry={addTemperatureEntry}
      />
    </div>
  );
};

export default App;
