import React, { useState } from 'react';
import { TemperatureEntry } from '../App';

interface TemperatureTableProps {
  entries: TemperatureEntry[];
  addEntry: (entry: TemperatureEntry) => void;
  removeEntry: (id: number) => void;
}

const TemperatureTable: React.FC<TemperatureTableProps> = ({ entries, addEntry, removeEntry }) => {
  const [newTime, setNewTime] = useState<number | ''>('');
  const [newTemperature, setNewTemperature] = useState<number | ''>('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime !== '' && newTemperature !== '') {
      addEntry({
        id: Date.now(),
        time: Number(newTime),
        temperature: Number(newTemperature)
      });
      setNewTime('');
      setNewTemperature('');
    }
  };

  return (
    <div>
      <h2>Temperature Table</h2>
      <form onSubmit={handleAddEntry}>
        <input
          type="number"
          value={newTime}
          onChange={(e) => setNewTime(Number(e.target.value))}
          placeholder="Time (minutes)"
        />
        <input
          type="number"
          value={newTemperature}
          onChange={(e) => setNewTemperature(Number(e.target.value))}
          placeholder="Temperature (°C)"
        />
        <button type="submit">Add Entry</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Time (minutes)</th>
            <th>Temperature (°C)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.time}</td>
              <td>{entry.temperature}</td>
              <td>
                <button onClick={() => removeEntry(entry.id)}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemperatureTable;