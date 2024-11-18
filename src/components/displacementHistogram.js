import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DisplacementHistogram = ({ japaneseShips, usShips }) => {
  const svgRefJapan = useRef();
  const svgRefUS = useRef();

  useEffect(() => {
    
    const createHistogram = (svgRef, data, color, title) => {
      
      d3.select(svgRef.current).selectAll("*").remove();

     
      const width = 500;
      const height = 500;
      const margin = { top: 40, right: 40, bottom: 60, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

     
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

     
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.displacement)])
        .range([0, innerWidth]);

      
      const histogram = d3.histogram()
        .domain(xScale.domain())
        .thresholds(20);

     

      
      const bins = histogram(data.map(d => d.displacement));

      
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([innerHeight, 0]);

      
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      
      g.selectAll('.bar')
        .data(bins)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.x0))
        .attr('y', d => yScale(d.length))
        .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr('height', d => innerHeight - yScale(d.length))
        .style('fill', color)
        .style('opacity', 0.7);

      
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => `${d/1000}k`);
      const yAxis = d3.axisLeft(yScale);

      g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis);

      g.append('g')
        .call(yAxis);

      
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 40)
        .attr('text-anchor', 'middle')
        .text('Displacement (tons)');

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .text('Number of Ships');
        

      
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(title);
    };

    
    createHistogram(svgRefJapan, japaneseShips, 'red', 'Japanese Ships');
    createHistogram(svgRefUS, usShips, 'blue', 'US Ships');

  }, [japaneseShips, usShips]);

  return (
    <div className="displacement-histograms">
         <h1 className="centered-title">Displacement Histograms</h1>
      <div className="histogram">
        <svg ref={svgRefJapan}></svg>
      </div>
      <div className="histogram">
        <svg ref={svgRefUS}></svg>
      </div>
      <div className="histogram-info">
        <h2>
        Is there any difference between the displacement distribution? Report your findings below.
        </h2>
        <h3>Range of Displacement:</h3>
        <ul>
          <li>Japanese ships extend to higher displacements (up to 65,000 tons)</li>
          <li>US ships have a smaller maximum displacement (up to about 45,000 tons)</li>
        </ul>

        <h3>Distribution Shape:</h3>
        <ul>
          <li>Both distributions are right-skewed (tail extends to the right)</li>
          <li>Japanese ships show a more continuous distribution</li>
          <li>US ships show a more multimodal distribution with distinct peaks around 5,000-10,000 tons and 25,000-30,000 tons</li>
        </ul>

        <h3>Most Common Size:</h3>
        <ul>
          <li>Japanese ships have their highest frequency around 5,000 tons (about 31 ships)</li>
          <li>US ships also peak around 5,000 tons but with fewer ships (about 24 ships)</li>
        </ul>

        <h3>Mid-range Characteristics:</h3>
        <ul>
          <li>Japanese ships show a gradual decline in frequency as displacement increases</li>
          <li>US ships have a notable secondary cluster around 25,000-30,000 tons, suggesting a specific class or type of vessel was common in this range</li>
        </ul>

        <h3>Largest Ships:</h3>
        <ul>
          <li>Japanese fleet includes a few very large ships (60,000+ tons)</li>
          <li>US fleet's largest ships are in the 45,000-ton range</li>
        </ul>
      </div>
    </div>
  );
};

export default DisplacementHistogram;