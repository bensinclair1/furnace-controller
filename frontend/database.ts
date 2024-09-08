import { timeStamp } from 'console';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('temperature_data.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Database connected');
        db.run(`CREATE TABLE IF NOT EXISTS data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          value INTEGER,
          timestamp ATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err);
            } else {
                const initialData = [
                    { value: 10, timestamp: Date.now() },
                    { value: 20, timestamp: Date.now() + 1000 },
                    { value: 15, timestamp: Date.now() + 2000 },
                    { value: 25, timestamp: Date.now() + 3000 },
                  ];
                
                initialData.forEach((item) => {
                    db.run('INSERT INTO data (value, timestamp) VALUES (?, ?)', [item.value, item.timestamp], (err) => {
                        if (err) {
                            console.error('Error inserting data', err);
                          }                        
                    })
                })
            }
        });   
    }
})

export default db