import express from 'express';
import cors from 'cors';
import db from './database';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM data ORDER BY timestamp ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/data', (req, res) => {
  const { value } = req.body;
  const timestamp = Date.now();
  db.run('INSERT INTO data (value, timestamp) VALUES (?, ?)', [value, timestamp], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, value, timestamp });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});