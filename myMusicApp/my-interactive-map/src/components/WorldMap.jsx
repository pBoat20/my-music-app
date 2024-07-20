import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './WorldMap.css';

// Changes the name of United States to USA for api use
const freedomCatcher = {
    "United States of America" : "USA"
};

// Builds the World map Component
const WorldMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [error, setError] = useState(null);
  const geoJsonRef = useRef();

  useEffect(() => {
    // Fetch GeoJSON data for the world map
    fetch('/src/assets/world-geojson.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setGeoData(data))
      .catch(error => setError(error.message));
  }, []);

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
      fillColor: '#FFB6C1',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const resetHighlight = (e) => {
    geoJsonRef.current.resetStyle(e.target);
  };

  const onEachCountry = (country, layer) => {
    layer.on({
      click: () => handleCountryClick(country),
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      pointerover: highlightFeature,
      pointerout: resetHighlight,
    });
  };

  const handleCountryClick = (country) => {
    //processes countries with acronyms
    const preCountryName = country.properties.admin;
    const countryName = freedomCatcher[preCountryName] || preCountryName;
    setCountryInfo({ name: countryName });

    // Call to fetch top tracks from the clicked county
    axios.get(`/api/top-tracks/${countryName}`)
      .then((response) => {  // Corrected the variable scoping here
        setCountryInfo(prevState => ({
          ...prevState,
          tracks: response.data,
        }));
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div className="container">
      <div className="country-info">
        {error && <p className="error-message">{error}</p>}
        {countryInfo ? (
          <>
            <h2>{countryInfo.name}</h2>
            {countryInfo.tracks && (
              <ol>
                {countryInfo.tracks.map((track, index) => (
                  <li key={index}>{track.track_name}</li>
                ))}
              </ol>
            )}
          </>
        ) : (
          <p>Click on a country to see the information.</p>
        )}
      </div>
      <div className="map-container">
        {geoData && (
          <MapContainer style={{ height: '100vh', width: '100%' }} zoom={2} center={[20, 0]}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={geoData} onEachFeature={onEachCountry} ref={geoJsonRef} />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
