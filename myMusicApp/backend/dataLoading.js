const mongodb = require('./mongos');
const { searchForPlaylists, getPlaylistTracks } = require('./spotifys');

const countries = ['Global', 'USA', 'Canada', 'Japan', 'Mexico', 'Brazil', 'France', 'Colombia', 'Spain',
'United Kingdom', 'Philippines', 'Argentina', 'Israel', 'China', 'Dominican Republic',
'Germany', 'Poland', 'Netherlands', 'Guatemala', 'South Korea', 'Chile',
'Indonesia', 'India', 'Taiwan', 'Honduras', 'Russia', 'Portugal', 'Venezuela', 'Turkey',
'Australia', 'Norway', 'Sweden', 'Greece', 'Peru', 'Uruguay', 'Thailand', 'Vietnam', 'Morocco',
'Paraguay', 'Ukraine', 'Nigeria', 'Denmark', 'Hungary', 'Bulgaria', 'El Salvador',
'Finland', 'Ecuador', 'South Africa', 'Belgium', 'Ireland', 'Costa Rica',
'Bolivia', 'Egypt', 'Malaysia'];

async function loadDb(token, db) {
    for(let country of countries){
        const countryPlaylist = `Top 50 - ${country}`;
        const playlistId = await searchForPlaylists(countryPlaylist, token);
        var tracks = '';

        if(playlistId) {
            tracks = await getPlaylistTracks(playlistId, token);    
        }

        //comparing timestamps to prevent adding extra data
        const oldTimestamp = await mongodb.checkTimeStamps(db, country);
        const newTimestamp = tracks[0].date_entered;

        if(oldTimestamp != newTimestamp){
            let isEmpty = await mongodb.isCollectionEmpty(db, country);
            // If the collection is empty, then use the insertTracks function, if not use replaceTracks
            if(isEmpty){
                await mongodb.insertTracks(db, country, tracks);
            } else {
                await mongodb.replaceTracks(db, country, tracks);
            }
        }
        else{
            console.log("%s is up to date", country);
            continue;
        }
    }
}

async function rawUpdate(token, db){
    const collections = await mongodb.getAvailableCountries(db);
    console.log(collections);

    for(let country of countries){
        const countryPlaylist = `Top 50 - ${country}`;
        const playlistId = await searchForPlaylists(countryPlaylist, token);
        var tracks = '';

        if(playlistId) {
            tracks = await getPlaylistTracks(playlistId, token);    
        }

        try{
            if(collections.includes(country)){
                await mongodb.replaceTracks(db, country, tracks);
            } else {
                await mongodb.insertTracks(db, country, tracks);
        }
        } catch(error){
            console.error(error);
        }   
    }
}

module.exports = {
    loadDb,
    rawUpdate
}