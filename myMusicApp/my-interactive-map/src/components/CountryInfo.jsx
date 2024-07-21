import React from 'react';
import exampleImage from '../assets/kitten.jpeg';
import '../styles/styles.css'

const CountryInfo = ({ error, countryInfo }) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      {error && <p className="error-message">{error}</p>}
      {countryInfo ? (
        <>
          <h2>{countryInfo.name}</h2>
          {countryInfo.tracks && (
            <ol role = "list" className ="p-6 divide-y divide-slate-200">
              {countryInfo.tracks.map((track, index) => (
                //<li key={index}>{track.track_name}</li>
                <li
                    key={index}
                    className={`flex py-4 px-4 w-full ${index === 0 ? 'pt-0' : ''} ${index === track.length - 1 ? 'pb-0' : ''} hover:bg-gray-400 rounded-lg`}
                    >
                    {/*<img className="h-12 w-12 rounded-lg" src={exampleImage} alt="" /> */}
                    <div
                        className="h-12 w-16 rounded-lg bg-cover bg-center hover-image"
                    ></div>
                    <div className="ml-3 overflow-hidden w-full">
                        <p className="text-sm font-medium text-slate-900">{track.track_name}</p>
                        <p className="text-sm text-slate-500 truncate">{track.artist_names}</p>
                    </div>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <p>Click on a country to see the information.</p>
      )}
    </div>
  );
};

export default CountryInfo;
