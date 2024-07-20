const mongodb = require('./mongos');
const { searchForPlaylists, getPlaylistTracks } = require('./spotifys');

const countries = ['USA', 'Canada', 'Japan', 'Mexico', 'Brazil'];


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



module.exports = {
    loadDb,
}