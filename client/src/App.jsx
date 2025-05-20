// src/App.jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const WIDTH = 800;
const HEIGHT = 600;

function App() {
  const svgRef = useRef();

  useEffect(() => {
    const drawNetwork = async () => {
      const response = await fetch('http://localhost:8080/ping');
      const data = await response.json();

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const nodes = [];
      const links = [];
      const switchMap = {};

      data.forEach(item => {
        if (!switchMap[item.switch]) {
          nodes.push({ id: item.switch, type: 'switch' });
          switchMap[item.switch] = true;
        }

        nodes.push({ id: item.end_device, type: 'device' });

        links.push({
          source: item.switch,
          target: item.end_device,
          alive: item.alive
        });
      });

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2));

      const link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', d => d.alive ? 'link-up' : 'link-down')
        .attr('stroke', d => d.alive ? 'green' : 'red')
        .attr('stroke-width', 2);

      const node = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 15)
        .attr('fill', d => d.type === 'switch' ? 'blue' : 'red');

      const label = svg.selectAll('.label')
        .data(nodes)
        .enter()
        .append('text')
        .text(d => d.id)
        .attr('font-size', 12)
        .attr('dy', -20);

      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);

        label
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });
    };

    drawNetwork();
    const interval = setInterval(drawNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Network Monitor</h2>
      <svg ref={svgRef} width={WIDTH} height={HEIGHT}></svg>
    </div>
  );
}

export default App;
