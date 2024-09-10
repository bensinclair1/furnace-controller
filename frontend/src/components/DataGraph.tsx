import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TemperatureEntry } from '../App';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

interface DataGraphProps {
  temperatureData: TemperatureEntry[];
  isPlaying: boolean;
  resetTrigger: number;
  setTemperatureSetPoint: (temperature: number | null) => void;
  getCurrentTemperature: () => number | null;
}

const DataGraph: React.FC<DataGraphProps> = ({ temperatureData, isPlaying, resetTrigger, setTemperatureSetPoint, getCurrentTemperature }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [realTimeData, setRealTimeData] = useState<TemperatureEntry[]>([]);

  // Effect for handling play/pause and time progression
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1/12);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  // Effect for updating temperature set point and real-time data
  useEffect(() => {
    updateTemperatureSetPoint(currentTime);
    if (isPlaying) {
      const currentTemp = getCurrentTemperature();
      if (currentTemp !== null) {
        setRealTimeData(prevData => {
          const lastPoint = prevData[prevData.length - 1];
          if (!lastPoint || lastPoint.time !== currentTime) {
            return [...prevData, { id: Date.now(), time: currentTime, temperature: currentTemp }];
          }
          return prevData;
        });
      }
    }
  }, [currentTime, temperatureData, isPlaying, getCurrentTemperature]);

  // Effect for handling reset
  useEffect(() => {
    setCurrentTime(0);
    setRealTimeData([]);
    updateTemperatureSetPoint(0);
  }, [resetTrigger]);

  const updateTemperatureSetPoint = (time: number) => {
    if (temperatureData.length > 1) {
      // Find the two data points that surround the current time
      const leftPoint = temperatureData.reduce((prev, curr) => 
        curr.time <= time && curr.time > prev.time ? curr : prev
      );
      const rightPoint = temperatureData.find(point => point.time > time) || temperatureData[temperatureData.length - 1];

      if (leftPoint && rightPoint && leftPoint.time !== rightPoint.time) {
        // Calculate the slope and intercept of the line between these two points
        const slope = (rightPoint.temperature - leftPoint.temperature) / (rightPoint.time - leftPoint.time);
        const intercept = leftPoint.temperature - slope * leftPoint.time;

        // Calculate the temperature at the current time
        const interpolatedTemperature = slope * time + intercept;

        setTemperatureSetPoint(interpolatedTemperature);
      } else {
        setTemperatureSetPoint(null);
      }
    } else {
      setTemperatureSetPoint(null);
    }
  };

  // Filter realTimeData to only include data up to the current time
  const visibleRealTimeData = realTimeData.filter(item => item.time <= currentTime);

  const chartData = {
    labels: [...temperatureData, ...visibleRealTimeData].map((item) => item.time),
    datasets: [
      {
        label: 'Set Temperature (°C)',
        data: temperatureData.map((item) => ({ x: item.time, y: item.temperature })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Real-time Temperature (°C)',
        data: visibleRealTimeData.map((item) => ({ x: item.time, y: item.temperature })),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Time (minutes)'
        },
        min: 0,
        ticks: {
          stepSize: 1
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)'
        },
        min: 0
      }
    },
    maintainAspectRatio: false,
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: 'line' as const,
            xMin: currentTime,
            xMax: currentTime,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px' }}>
      <h2>Temperature Graph</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DataGraph;