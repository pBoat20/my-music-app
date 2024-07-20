const express = require('express')
const cors = require('cors');
const mongodb = require('./mongos');

const { loadDb } = require('./dataLoading');
const { getAccessToken } = require('./spotifys');

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

var token = null;

mongodb.connectToServer((err, db) => {
  if (err) {
      console.error(err);
      process.exit(1); // Optionally exit if DB connection cannot be established
  }

  // Start the server only after connecting to the database
  app.listen(port, () => {
      console.log(`Server running on port ${port}`);
  });
});

app.get('/insert', async (req, res) => {
  if(!token) {
    token = await getAccessToken();
  }

  try {
    await loadDb(token, db);
    res.status(201).send({
      success: true,
      message: "Tracks inserted successfully"
    })
  }
  catch (error) {
    console.error("Failed to insert tracks:", error);
    res.status(500).send({
        success: false,
        message: "Failed to insert tracks",
        error: error.message
    });
  }
});

app.get('/api/top-tracks/:countryName', async (req, res) => {
  const db = mongodb.getDb()
  const countryName = req.params.countryName;

  try {
    const tracks = await mongodb.getTracksByCountry(db, countryName);
    //console.log(tracks);
    res.json(tracks);
  } catch (error){
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

