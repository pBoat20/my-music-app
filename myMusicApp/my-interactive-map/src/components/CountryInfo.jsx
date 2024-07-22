import React, { useEffect, useState } from 'react';
import exampleImage from '../assets/kitten.jpeg';
import '../styles/styles.css'

const CountryInfo = ({ error, countryInfo }) => {


  return (
    <div className="h-full overflow-y-auto p-6">
          <h2 className = "text-center font-bold font-sans"> Top 10 Tracks in {countryInfo.name}</h2>
          {countryInfo.tracks && (
            <ol role = "list" className ="p-6 divide-y divide-slate-200">
              {countryInfo.tracks.map((track, index) => (
                <li
                    key={index}
                    className={`flex py-4 px-4 w-full ${index === 0 ? 'pt-0' : ''} ${index === countryInfo.length - 1 ? 'pb-0' : ''} hover:bg-gray-400 rounded-lg`}
                    >
                    <img className="h-12 w-12 rounded-lg" src={track.album_cover_url} alt="" /> 
                    <div className="ml-3 overflow-hidden w-full">
                        <p className="text-sm font-medium text-slate-900">{track.track_name}</p>
                        <p className="text-sm text-slate-500 truncate">{track.artist_names}</p>
                    </div>
                </li>
              ))}
            </ol>
          )}
    </div>
  );
};

export default CountryInfo;
