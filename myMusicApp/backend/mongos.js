
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://tonylgarza3532:zW7egZalUusn8wyF@regionalmusic.cn2wuse.mongodb.net/?retryWrites=true&w=majority&appName=RegionalMusic"; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let dbConnection;

// Function to connect to the server, as well as close it when finished
const connectToServer = async function (callback) {
  try{
    client.connect(function (err, db) {
        if (err || !db) {
            return callback(err);
        }
        dbConnection = db.db("Countries");
        console.log("Successfully connected to MongoDB.");
        return callback(null, dbConnection);
    });
  } finally {
    await client.close();
  }
};

const getDb = function () {
  return dbConnection;
};

// Function to insert tracks
async function insertTracks(mongodb, country, tracks) {
  const collection = mongodb.collection(country);

  try {
      const result = await collection.insertMany(tracks);
      console.log(`${result.insertedCount} tracks were inserted for ${country}`);
      return result;
  } catch (error) {
      console.error(`Failed to insert tracks for ${country}`, error);
  }
}

async function checkTimeStamps(mongodb, country){
  const collection = mongodb.collection(country);
  //findOne modifier to search for only the date_entered in each item
  const options = {
    projection: { date_entered: 1, _id: 0}
  }
  try {
    const tracks = await collection.findOne({}, options);
    //console.log("Date Entered:", tracks.date_entered);
    return tracks.date_entered;
  } catch (error){
    console.error("Failed to fetch the first timestamp:", error);
  }
}

async function deleteExistingTracks(mongodb, country){
  try {
      const result = await mongodb.collection(country).deleteMany({});
      console.log(`${result.deletedCount} documents were deleted`);
  } catch (error) {
      console.error("Failed to delete documents:", error);
  }
};

async function replaceTracks(mongodb, country, newTracks) {
  await deleteExistingTracks(mongodb, country);
  await insertTracks(mongodb, country, newTracks);
}

async function isCollectionEmpty(mongodb, country) {
  const collection = mongodb.collection(country);

  try{
    const count = await collection.countDocuments();
    if(count === 0){
      return true;
    } else{
      return false;
    }
  } catch(error) {
    console.error("Failed to check if collections are empty", error);
  }
}

// Gets tracks by country from the database
async function getTracksByCountry(mongodb, country){
  const collection = mongodb.collection(country);

  const tracks = await collection.find({}, {projection: { track_name: 1, _id: 0 } }).toArray();
  //console.log(tracks);

  return tracks;
}

module.exports = {
    connectToServer,
    getDb,
    insertTracks,
    checkTimeStamps,
    replaceTracks,
    isCollectionEmpty,
    getTracksByCountry
}