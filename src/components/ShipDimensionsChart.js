// src/components/ShipDimensionsChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ShipDimensionsChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    
    d3.select(svgRef.current).selectAll("*").remove();

    
    const getShipType = (shipClass) => {
      if (!shipClass) return 'Unknown';
      shipClass = shipClass.toLowerCase();
      if (shipClass.includes('carrier')) return 'Carrier';
      if (shipClass.includes('battleship')) return 'Battleship';
      if (shipClass.includes('cruiser')) return 'Cruiser';
      
    };

    const processedShips = data
      .map(ship => ({
        name: ship.name,
        length: parseFloat(ship.Length),
        beam: parseFloat(ship.Beam),
        shipType: getShipType(ship['Ship Class'])
      }))
      .filter(ship => !isNaN(ship.length) && !isNaN(ship.beam));

    
    const width = 800;
    const height = 600;
    const margin = { top: 60, right: 250, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(processedShips, d => d.length)])
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedShips, d => d.beam)])
      .range([innerHeight, 0])
      .nice();

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(['Carrier', 'Battleship', 'Cruiser']);

    const symbolScale = d3.scaleOrdinal()
      .domain(['Carrier', 'Battleship', 'Cruiser'])
      .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolDiamond]);

    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .text('Length (feet)');

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text('Beam (feet)');

    
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    
    svg.selectAll('.point')
      .data(processedShips)
      .enter()
      .append('path')
      .attr('class', 'point')
      .attr('d', d => d3.symbol().type(symbolScale(d.shipType)).size(100)())
      .attr('transform', d => `translate(${xScale(d.length)},${yScale(d.beam)})`)
      .attr('fill', d => colorScale(d.shipType))
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`
          Name: ${d.name}<br/>
          Type: ${d.shipType}<br/>
          Length: ${d.length} ft<br/>
          Beam: ${d.beam} ft
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(colorScale.domain())
      .enter().append('g')
      .attr('transform', (d, i) => `translate(${innerWidth + 50},${i * 20 + 20})`);

    legend.append('path')
      .attr('d', d => d3.symbol().type(symbolScale(d)).size(100)())
      .attr('fill', colorScale);

    legend.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .text(d => d);
      legend.enter().append('g')
  .attr('transform', (d, i) => `translate(${innerWidth + 30},${i * 20})`); // Increased x offset from 10 to 30

    
    // svg.append('text')
    //   .attr('x', innerWidth / 2)
    //   .attr('y', -20)
    //   .attr('text-anchor', 'middle')
    //   .style('font-size', '16px')
    //   .style('font-weight', 'bold') 
    //   .text('Ship Length vs Beam by Ship Type');

  }, [data]);

  
    return (
        <div className="ship-dimensions-chart">
            <h2> Ship Length vs Beam by Ship Type </h2>
          <svg ref={svgRef}></svg>
          <div className="analysis-container">
            <h3>Analysis of Ship Types and Sizes:</h3>
            
            <h4>Ship Types and Sizes</h4>
            <p>Carriers (blue circles) tend to be the largest ships, with the greatest length and beam. 
               Battleships (orange squares) are also large, but generally smaller than carriers. 
               Cruisers (green triangles) are typically smaller than both carriers and battleships.</p>
      
            <h4>Length vs Beam Relationship</h4>
            <p>There's a positive correlation between ship length and beam across all ship types. 
               As ships get longer, they tend to get wider as well. However, this relationship isn't 
               perfectly linear, suggesting other factors influence ship design.</p>
      
            <h4>Ship Type Clustering</h4>
            <p>Carriers are clustered in the upper right of the plot, indicating they are consistently 
               the largest ships. Battleships form a cluster slightly below and to the left of carriers. 
               Cruisers are more spread out but generally occupy the lower left portion of the plot.</p>
      
            <h4>Design Variations</h4>
            <p>Within each ship type, there's variation in dimensions and crew size, likely reflecting 
               different classes or generations of ships.</p>
      
            <h4>Range of Sizes</h4>
            <p>The plot shows a wide range of ship sizes, from small cruisers around 300-400 feet in 
               length to large carriers over 800 feet long.</p>
      
            <h4>Beam Limitations</h4>
            <p>There seems to be an upper limit to ship beam around 140-150 feet.</p>
          </div>
        </div>
      );

};

export default ShipDimensionsChart;