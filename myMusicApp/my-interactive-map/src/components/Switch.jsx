import React from 'react';

//Component for the toggle switch between track and genre
export function ToggleButton({ isOn, handleClick }) {
  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1 text-sm rounded-full transition-colors duration-200 focus:outline-none ${
        isOn ? 'bg-black text-white' : 'bg-gray-200 text-black'
      }`}
      style={{ minWidth: '200px' }}
    >
      {isOn ? 'Tracks' : 'Genres'}
    </button>
  );
}
