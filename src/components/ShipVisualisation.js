import React, { useEffect, useRef, useState } from 'react';




import DisplacementHistogram from './displacementHistogram';

const ShipVisualization = ({ data }) => {
  const svgRef = useRef();
  const [processedData, setProcessedData] = useState({
    japaneseShips: [],
    usShips: []
  });

  useEffect(() => {
    if (!data) return;

  
    const cleanNumber = (str) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0]) : null;
    };

    const japaneseShips = data.filter(ship => ship.Country === 'Japan' && ship.Displacement);
    const usShips = data.filter(ship => ship.Country === 'United States' && ship.Displacement);

    const cleanDisplacement = ship => cleanNumber(ship.Displacement.split(';')[0]);

    const cleanedJapaneseShips = japaneseShips
      .map(ship => ({
        name: ship.name,
        displacement: cleanDisplacement(ship)
      }))
      .filter(ship => ship.displacement);

    const cleanedUsShips = usShips
      .map(ship => ({
        name: ship.name,
        displacement: cleanDisplacement(ship)
      }))
      .filter(ship => ship.displacement);

    setProcessedData({
      japaneseShips: cleanedJapaneseShips,
      usShips: cleanedUsShips
    });



  }, [data]);

  return (
    <div className="ship-visualization">
    
      <div className="timeline">
        <svg ref={svgRef}></svg>
      </div>
      <div className="displacement">
        <DisplacementHistogram 
          japaneseShips={processedData.japaneseShips}
          usShips={processedData.usShips}
        />
      </div>
    </div>
  );
};

export default ShipVisualization;