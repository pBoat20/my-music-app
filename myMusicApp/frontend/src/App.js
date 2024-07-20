import React from 'react';
import { MantineProvider } from '@mantine/core';
import MapChart from './components/MapChart';
import './index.css';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div className="App">
        <header className="App-header">
          <h1 className="text-3xl font-bold mb-5">World Map and Top Tracks</h1>
        </header>
        <main>
          <MapChart />
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;
