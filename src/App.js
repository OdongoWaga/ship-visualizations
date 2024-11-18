import React, { useEffect, useState } from 'react';
import ShipVisualization from './components/ShipVisualisation';
import shipsData from './ships.json';
import LBRChart from './components/LBRChart';
import ShipDimensionsChart from './components/ShipDimensionsChart';
import './App.css';


import ShipClassChart from './components/ShipClassChart';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(shipsData);
  }, []);

  return (
    <div className="App">
      <h1>Ship Visualization Dashboard</h1>
      { <ShipVisualization data={data} />}
      { <LBRChart data={data} />}
      { <ShipClassChart data={data} />}
      { <ShipDimensionsChart data={data} />}
    </div>
  );
}

export default App;
