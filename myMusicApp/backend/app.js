const express = require('express')
const cors = require('cors');
const axios = require('axios');
const mongodb = require('./mongos');

const { loadDb, forceUpdate } = require('./dataLoading');
const { getAccessToken, fetchTrackData, getPlaylistTracks, searchForPlaylists, fetchArtistGenre } = require('./spotifys');

const app = express();
const port = 3000;

// Cache to keep the express server from having to recall certain functions to improve performance
const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000;

const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

let token = null;

const setAcessToken = async() => {
  try{
    token = await getAccessToken();
  } catch(error){
    console.error("Failed to set AccessToken", error);
  }
}

mongodb.connectToServer((err, db) => {
  if (err) {
      console.error(err);
      process.exit(1); // Optionally exit if DB connection cannot be established
  }

  // Start the server only after connecting to the database
  app.listen(port, async () => {
      await setAcessToken();
      console.log(`Server running on port ${port}`);
  });
});

app.get('/insert', async (req, res) => {
  const db = mongodb.getDb();

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

app.get('/force', async (req, res) => {
  const db = mongodb.getDb();

  try {
    await forceUpdate(token, db);
    res.sendStatus(200);
  } catch (error){
    res.status(500).json({ error: 'Failed to insert tracks' });
  }
})

app.get('/api/track/:id', async (req, res) => {
  const trackId = req.params.id;
  try{
    const trackData = await fetchTrackData(token, trackId);
    const { album, preview_url } = trackData.data;
    res.json({
      albumCover: album.images[0].url,
      trackPreview: preview_url
    });
  } catch(error){
    res.status(500).json({ error: 'Failed to fetch track Data' });
  }
});

// Route to get spotify album cover URL and song preview URL
app.get('/api/spotify/:trackId', async (req, res) => {
  const trackId = req.params.trackId;

  // API call to spotify to get album coverURL and song preview URL
  try {
    console.log(`Fetching Spotify data for trackId: ${trackId}`);
    const response = await fetchTrackData(token, trackId);
    console.log(response);

    const { album, preview_url } = response.data;
    const albumCoverUrl = album.images[0].url;
    const data = { albumCoverUrl, previewUrl: preview_url };

    //cache.set(trackId, { data, timestamp: Date.now() });
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/analyze', async(req, res) => {
  const data = await getPlaylistTracks("37i9dQZEVXbLRQDuF5jeBp", token);
  //const data = await fetchArtistGenre(token, "74KM79TiuVKeVCqs8QtB0B");

  res.json(data);
});

app.get('/genres', async(req, res) => {
  const db = mongodb.getDb();

  const genres = await mongodb.getGenresByCountry(db, 'USA');

  console.log(genres);
  res.json(genres);
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

