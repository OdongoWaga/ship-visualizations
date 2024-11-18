
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ShipClassChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    
    d3.select(svgRef.current).selectAll("*").remove();

    
    const shipCounts = d3.rollup(
      data,
      v => v.length,
      d => d['Ship Class']
    );

    
    const sortedCounts = Array.from(shipCounts, ([className, count]) => ({
      className,
      count
    }))
      .filter(d => d.className) 
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); 

    
    const width = 1000;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 150, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    
    const xScale = d3.scaleBand()
      .domain(sortedCounts.map(d => d.className))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(sortedCounts, d => d.count)])
      .range([innerHeight, 0]);

    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    
    svg.selectAll('.bar')
      .data(sortedCounts)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.className))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.count))
      .attr('fill', '#69b3a2')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('fill', '#4a7a6c');
        
        tooltip
          .style('opacity', 1)
          .html(`${d.className}<br>${d.count} ships`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .attr('fill', '#69b3a2');
        
        tooltip.style('opacity', 0);
      });

    
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .each(function(d) {
        
        const text = d3.select(this);
        const words = d.split(' ');
        if (words.length > 3) {
          text.text(words.slice(0, 3).join(' ') + '...');
        }
      });

    svg.append('g')
      .call(d3.axisLeft(yScale));

   
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Ship Class');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text('Number of Ships');

    
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

  }, [data]);

  return (
    <div className="ship-class-chart">
      <h2>Top 20 Ship Classes by Number of Ships</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ShipClassChart;