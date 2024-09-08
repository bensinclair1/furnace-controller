import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TemperatureEntry } from '../App';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataGraphProps {
  temperatureData: TemperatureEntry[];
}

const DataGraph: React.FC<DataGraphProps> = ({ temperatureData }) => {
  const chartData = {
    labels: temperatureData.map((item) => item.time),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData.map((item) => item.temperature),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '400px' }}>
      <h2>Temperature Graph</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DataGraph;