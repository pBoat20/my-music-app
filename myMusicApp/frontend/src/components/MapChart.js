import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { Container, Title, List, ListItem } from '@mantine/core';

const MapChart = () => {
  const [geoData, setGeoData] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch('/countries-50m.json')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched geo data:', data);
        setGeoData(data);
      })
      .catch(error => console.log('Error fetching the geo data: ', error));
  }, []);

  const handleCountryClick = async (countryName) => {
    try {
      console.log(`Fetching tracks for ${countryName}`);
      const response = await fetch(`/retrieve?countryName=${countryName}`);
      const data = await response.json();
      console.log('Fetched track data:', data);
      setTracks(data);
      console.log('Updated tracks state:', data);
    } catch (error) {
      console.log('Error fetching the track data: ', error);
    }
  };

  if (!geoData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  console.log('Tracks to display:', tracks);

  return (
    <Container>
      <ComposableMap data-tip="">
        <ZoomableGroup>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.NAME || geo.properties.name || 'Unknown';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(countryName)}
                    onMouseEnter={() => {
                      setTooltipContent(countryName);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    style={{
                      default: { fill: '#D6D6DA', outline: 'none' },
                      hover: { fill: '#F53', outline: 'black' },
                      pressed: { fill: '#E42', outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip>{tooltipContent}</Tooltip>
      {tracks.length > 0 && (
        <div className="mt-5">
          <Title order={2} className="text-2xl font-semibold mb-3">Top 10 Tracks</Title>
          <List>
            {tracks.map((track, index) => (
              <ListItem key={index} className="mb-1">{track.track_name}</ListItem>
            ))}
          </List>
        </div>
      )}
    </Container>
  );
};

export default MapChart;
