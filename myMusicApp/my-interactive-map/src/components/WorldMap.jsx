import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css'
import CountryInfo from './CountryInfo';
import CountrySearchBar from './CountrySearchBar';
import SearchControl from './SearchControl';

// Changes the name of United States to USA for api use
const freedomCatcher = {
    "United States of America" : "USA"
};

// Hard-coded list of countries which have data
const specialCountries = ['Global', 'USA', 'Canada', 'Japan', 'Mexico', 'Brazil', 'France', 'Colombia', 'Spain',
  'United Kingdom', 'Philippines', 'Argentina', 'Israel', 'China', 'Dominican Republic',
  'Germany', 'Poland', 'Netherlands', 'Guatemala', 'South Korea', 'Chile',
  'Indonesia', 'India', 'Taiwan', 'Honduras', 'Russia', 'Portugal', 'Venezuela', 'Turkey',
  'Australia', 'Norway', 'Sweden', 'Greece', 'Peru', 'Uruguay', 'Thailand', 'Vietnam', 'Morocco',
  'Paraguay', 'Ukraine', 'Nigeria', 'Denmark', 'Hungary', 'Bulgaria', 'El Salvador',
  'Finland', 'Ecuador', 'South Africa', 'Belgium', 'Ireland', 'Costa Rica',
  'Bolivia', 'Egypt', 'Malaysia'];
  

  

// Builds the World map Component
const WorldMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [countryInfo, setCountryInfo] = useState({ name: 'Global', tracks: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const geoJsonRef = useRef();

  //useEffect for mapchart
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

      //Sets initial state to Global
      axios.get('/api/top-tracks/Global')
      .then((response) => {
        setCountryInfo(prevState => ({
          ...prevState,
          tracks: response.data,
        }));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  //Highlights country when scrolled over
  const highlightFeature = (e) => {
    const layer = e.target;
    const countryName = layer.feature.properties.admin;

    layer.setStyle({
      weight: 2,
      dashArray: '',
      fillOpacity: 0.7,
      fillColor: '#F0E68C',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const resetHighlight = (e) => {
    geoJsonRef.current.resetStyle(e.target);
  };

  //Handles highlighting
  const onEachCountry = (country, layer) => {
    layer.on({
      click: () => handleCountryClick(country),
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      pointerover: highlightFeature,
      pointerout: resetHighlight,
    });
  };

  //Creates the button to toggle Global List, and makes sure to only generate one
  const CustomButton = () => {
    const map = useMap();

    useEffect(() => {
      const customControl = L.Control.extend({
        onAdd: function(map) {
          const div = L.DomUtil.create('div', 'custom-button');
          div.innerHTML = `
            <button class="bg-blue-500 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-700">
              Global
            </button>
          `;
          
          div.style.cursor = 'pointer';

          div.onclick = function() {
            setCountryInfo({name: 'Global'});
            setLoading(true);
            axios.get('/api/top-tracks/Global')
            .then((response) => {
              setCountryInfo(prevState => ({
                ...prevState,
                tracks: response.data,
              }));
              setLoading(false);
            })
            .catch((error) => {
              setError(error.message);
              setLoading(false);
            });
          };

          return div;
        }
      });

      const controlInstance = new customControl({ position: 'topleft' });
      map.addControl(controlInstance);

      // Cleanup function to remove the control when component unmounts
      return () => {
        map.removeControl(controlInstance);
      };
    }, [map]);

    return null;
  };

  //Handles how frontend processes backend data when a country is clicked
  const handleCountryClick = (country) => {
    //processes countries with acronyms
    const preCountryName = country.properties.admin;
    const countryName = freedomCatcher[preCountryName] || preCountryName;
    setCountryInfo({ name: countryName });
    setLoading(true);

    // Call to fetch top tracks from the clicked county
    axios.get(`/api/top-tracks/${countryName}`)
      .then((response) => {  // Corrected the variable scoping here
        setCountryInfo(prevState => ({
          ...prevState,
          tracks: response.data,
        }));
        setLoading(false);
      })
      .catch((error) => {
      setError(error.message);
      setLoading(false);
    });
  };

  //Determines the color of the country based on if it has data or not
  const countryStyle = (feature) => {
    const countryName = freedomCatcher[feature.properties.admin] || feature.properties.admin;
    return {
      fillColor: specialCountries.includes(countryName) ? '#00FA9A' : '#C0C0C0',
      weight: 2,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.7
    };
  };

  const handleCountrySelect = (countryName) => {
    setCountryInfo({ name: countryName });
    axios.get(`/api/top-tracks/${countryName}`)
      .then((response) => {
        setCountryInfo(prevState => ({
          ...prevState,
          tracks: response.data,
        }));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen w-screen">
      <div className = "w-1/3 h-screen overflow-y-auto">
        <CountryInfo error={error} countryInfo={countryInfo} loading={loading}/>
      </div>
      <div className="w-2/3 border border-gray-300 shadow-lg">
        {geoData && (
          <MapContainer style={{ height: '100vh', width: '100%' }} zoom={2} center={[20, 0]}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <div
              style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              }}>
              <CountrySearchBar countries={ specialCountries } onSelectCountry={ handleCountrySelect } />
            </div>
            <GeoJSON data={geoData} onEachFeature={onEachCountry} style={countryStyle} ref={geoJsonRef} />
            <CustomButton />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
