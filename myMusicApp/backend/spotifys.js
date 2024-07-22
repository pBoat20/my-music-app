const axios = require('axios');
const qs = require('querystring');

const clientId = '5011c5f2cb99440ca24bcf86bb636f58';
const clientSecret = '62b8b5a24f2946189e1d7253575e2488';

// Function to get an access token using client credentials Flow
async function getAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({ 'grant_type': 'client_credentials' });
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        console.log('Successfully obtained access token');
        return response.data.access_token;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        return null;
    }
}

// Function to get the get playlist by search query
async function searchForPlaylists(country, token) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                q: country,
                type: 'playlist',
                limit: 1
            }
        });
        return response.data.playlists.items[0].id;
    } catch (error) {
        console.error('Error searching for playlists:');
        return null;
    }
}

// Function to get tracks from a playlist
async function getPlaylistTracks(playlistId, token) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const now = new Date();
        const dateEntered = now.toDateString();
        return response.data.items.map(item => {
            return {
                track_name: item.track.name,
                artist_names: item.track.artists.map(artist => artist.name).join(', '),
                spotify_track_id: item.track.id,
                album_cover_url: item.track.album.images[0].url,
                preview_url: item.track.preview_url,
                date_entered: dateEntered
            };
        }).slice(0,10); //set limit to 10
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
        return [];
    }
}

async function fetchTrackData(token, trackId){
    try {
        const trackData = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
        return trackData;
    } catch (error){
        console.error('Error fetching the track data');
    }
}

module.exports = {
    getAccessToken,
    getPlaylistTracks,
    searchForPlaylists,
    fetchTrackData
}
