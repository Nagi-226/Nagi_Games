const express = require('express');
const cors = require('cors');
const path = require('path');
const { DatabaseWrapper } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

// Initialize DB before starting server
DatabaseWrapper.initialize().then(() => {
  const cardRoutes = require('./routes/cards');
  const spreadRoutes = require('./routes/spreads');
  const readingRoutes = require('./routes/readings');

  app.use('/api/cards', cardRoutes);
  app.use('/api/spreads', spreadRoutes);
  app.use('/api/readings', readingRoutes);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize database:", err);
});

module.exports = app;
