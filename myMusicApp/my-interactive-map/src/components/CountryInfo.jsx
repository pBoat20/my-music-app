import React, { useEffect, useState } from 'react';
import playButtonImage from '../assets/play-button.png';
import pauseButtonImage from '../assets/pause-button.png'
import '../styles/styles.css'

const CountryInfo = ({ error, countryInfo, loading }) => {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [playingUrl, setPlayingUrl] = useState(null);

    const handleClick = (previewUrl) => {
        if (currentAudio) {
            currentAudio.pause();
            setCurrentAudio(null);
            setPlayingUrl(null);
        }
        if (previewUrl !== playingUrl) {
            const audio = new Audio(previewUrl);
            audio.play();
            setCurrentAudio(audio);
            setPlayingUrl(previewUrl);
        }
    };

    if (error) {
        return <div className="h-full p-6">Error: {error}</div>;
    }

    if (loading) {
        return <div className="text-center font-bold font-sans">Loading Track List...</div>;
    }

    if (!countryInfo.tracks) {
        return <div className="h-full p-6">{countryInfo.name}</div>;
    }
 
  return (
    <div className="h-full overflow-y-auto p-6">
          <h2 className = "text-center font-bold font-sans"> Top 10 Tracks in {countryInfo.name}</h2>
          {countryInfo.tracks && (
            <ol role = "list" className ="p-6 divide-y divide-slate-200">
              {countryInfo.tracks.map((track, index) => (
                <li
                    key={index}
                    className={`flex py-4 px-4 w-full hover:bg-gray-400 rounded-lg`}
                    >
                    <img className="h-12 w-12 rounded-lg" src={track.album_cover_url} alt="" /> 
                    <div className="ml-3 overflow-hidden w-full">
                        <p className="text-sm font-medium text-slate-900">{track.track_name}</p>
                        <p className="text-sm text-slate-500 truncate">{track.artist_names}</p>
                    </div>
                    {track.preview_url && (
                        <button
                        onClick={() => handleClick(track.preview_url)}
                        className="h-12 w-12 bg-no-repeat bg-center bg-contain border-none cursor-pointer"
                        style={{ backgroundImage: `url(${playingUrl === track.preview_url ? pauseButtonImage : playButtonImage})` }}
                    />
                    )}
                </li>
              ))}
            </ol>
          )}
    </div>
  );
};

export default CountryInfo;
