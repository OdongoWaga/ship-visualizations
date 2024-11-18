import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LBRChart = ({ data }) => {
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
      return 'Other';
    };

    
    const shipsByType = d3.group(
      data
        .map(ship => ({
          type: getShipType(ship['Ship Class']),
          lbr: parseFloat(ship.Length) / parseFloat(ship.Beam)
        }))
        .filter(ship => !isNaN(ship.lbr)),
      d => d.type
    );

    
    const stats = Array.from(shipsByType, ([type, ships]) => {
      const values = ships.map(s => s.lbr).sort(d3.ascending);
      return {
        type,
        mean: d3.mean(values),
        median: d3.median(values),
        q1: d3.quantile(values, 0.25),
        q3: d3.quantile(values, 0.75)
      };
    }).filter(s => s.type !== 'Other' && s.type !== 'Unknown');

    
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

   
    const xScale = d3.scaleBand()
      .domain(stats.map(d => d.type))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stats, d => Math.max(d.q3 * 1.1, d.mean * 1.1))])
      .range([innerHeight, 0]);

   
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    
    svg.selectAll('.bar')
      .data(stats)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.type))
      .attr('y', d => yScale(d.mean))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.mean))
      .attr('fill', '#69b3a2')
      .attr('opacity', 0.7);

    
    svg.selectAll('.box')
      .data(stats)
      .enter()
      .append('rect')
      .attr('class', 'box')
      .attr('x', d => xScale(d.type) + xScale.bandwidth()/4)
      .attr('y', d => yScale(d.q3))
      .attr('width', xScale.bandwidth()/2)
      .attr('height', d => yScale(d.q1) - yScale(d.q3))
      .attr('fill', '#ff7f50')
      .attr('opacity', 0.5);

    
    svg.selectAll('.median')
      .data(stats)
      .enter()
      .append('line')
      .attr('class', 'median')
      .attr('x1', d => xScale(d.type) + xScale.bandwidth()/4)
      .attr('x2', d => xScale(d.type) + xScale.bandwidth()*3/4)
      .attr('y1', d => yScale(d.median))
      .attr('y2', d => yScale(d.median))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    
    svg.append('text')
      .attr('x', innerWidth/2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .text('Ship Type');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight/2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text('Length-to-Beam Ratio (LBR)');

  }, [data]);

  return (
    <div className="lbr-chart">
      <h2>Length-to-Beam Ratio Comparison</h2>
      <svg ref={svgRef}></svg>
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color mean"></div>
          <span>Mean LBR</span>
        </div>
        <div className="legend-item">
          <div className="legend-color iqr"></div>
          <span>Interquartile Range (IQR)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color median"></div>
          <span>Median LBR</span>
        </div>
      </div>
    </div>
  );
};

export default LBRChart;