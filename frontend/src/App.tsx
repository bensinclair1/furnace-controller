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

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/temperature");
        console.log(response.data.temperature);
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

  return (
    <div className="App">
      <h1>Current Temperature = {currentTemperature !== null ? `${currentTemperature}°C` : 'Loading...'}</h1>
      <DataGraph temperatureData={temperatureData} />
      <TemperatureTable
        entries={temperatureData}
        removeEntry={removeTemperatureEntry}
        addEntry={addTemperatureEntry}
      />
    </div>
  );
};

export default App;
