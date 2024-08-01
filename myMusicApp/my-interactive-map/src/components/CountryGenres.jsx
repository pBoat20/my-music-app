import React from 'react';
import spotifyLogo from '../assets/spotify-logo1.png';

const CountryGenres = ({ error, countryGenres, loading }) => {
  //Function to capitalize the first letter of each genre, even if its multiple words
  const capitalizeFirstLetter = (string) => {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  //Error catcher
  if (error) {
    return <div className="h-full p-6">Error: {error}</div>;
  }

  //Loading Screen
  if (loading) {
      return <div className="text-center font-bold font-sans py-6">Loading Genre List...</div>;
  }

  //For countries with no data
  if (!countryGenres.genres || countryGenres.genres.length === 0) {
    return <div className="h-full p-6 py-6 text-center font-bold font-sans">No Genre Data For {countryGenres.name}</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-center font-bold font-sans">Popular Genres in {countryGenres.name}</h2>
      <p className="text-center text-sm font-medium font-sans"> Data from <img className="inline h-4 w-26" src={spotifyLogo}></img>
      </p>
      {countryGenres.genres && (
        <ul role="list" className="p-6 divide-y divide-slate-200">
          {countryGenres.genres.map((item, index) => (
            <li 
              key={index}
              className={`flex py-4 px-4 w-full hover:bg-gray-400 rounded-lg`}
              >
              <p className="text-sm font-medium text-slate-900">
                {capitalizeFirstLetter(item.genre)} - {item.count} Tracks
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryGenres;
