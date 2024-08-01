import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';

const SearchControl = ({ children }) => {
  const map = useMap();

  useEffect(() => {
    // Create a new control container
    const controlDiv = L.DomUtil.create('div', 'centered-control');
    controlDiv.style.position = 'absolute';
    controlDiv.style.top = '10px'; // Position from the top
    controlDiv.style.left = '50%'; // Center horizontally
    controlDiv.style.transform = 'translateX(-50%)'; // Adjust for center alignment
    controlDiv.style.zIndex = '1000'; // Ensure it's above other map elements
    controlDiv.style.width = 'fit-content'; // Ensure it fits its content
    controlDiv.style.padding = '5px'; 
    controlDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; 
    controlDiv.style.borderRadius = '5px'; 

    // Initialize the React root
    const root = createRoot(controlDiv);

    const customControl = L.Control.extend({
      onAdd: function () {
        // Render the React component into the controlDiv
        root.render(children);
        return controlDiv;
      }
    });

    // Add the control to the map
    const controlInstance = new customControl({ position: 'topleft' });
    map.addControl(controlInstance);

    // Cleanup function
    return () => {
      // Request animation frame to safely unmount after render completion
      requestAnimationFrame(() => {
        root.unmount();
        map.removeControl(controlInstance);
      });
    };
  }, [map, children]);

  return null;
};

export default SearchControl;
