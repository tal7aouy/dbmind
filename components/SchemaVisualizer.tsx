'use client';
import { useEffect, useRef } from 'react';
import { DBSchema } from '@/types/schema';
import * as d3 from 'd3';

interface Props {
  schema: DBSchema;
}

export default function SchemaVisualizer({ schema }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !schema) return;

    d3.select(svgRef.current).selectAll('*').remove();

    // Set up the SVG
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-300)) // Reduced strength
      .force('center', d3.forceCenter(width / 2, height / 2));
      
    // Transform schema data for visualization
    const nodes = schema.tables.map(table => ({
      id: table.name,
      ...table,
      fx: null,
      fy: null
    }));

    const links = schema.relationships.map(rel => ({
      source: rel.from,
      target: rel.to,
      type: rel.type
    }));

    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    // Add nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .style('cursor', 'move');

    // Add rectangles for tables
    node.append('rect')
      .attr('width', 200)
      .attr('height', (d: any) => 30 + d.columns.length * 20)
      .attr('fill', 'white')
      .attr('stroke', '#333')
      .attr('rx', 6);

    // Add table names
    node.append('text')
      .text((d: any) => d.name)
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', '#333')
      .attr('font-weight', 'bold');

    // Add column names
    node.each((d: any, i, nodes) => {
      const currentNode = d3.select(nodes[i]);
      d.columns.forEach((column: any, index: number) => {
        currentNode.append('text')
          .text(`${column.name}: ${column.type}`)
          .attr('x', 10)
          .attr('y', 45 + index * 20)
          .attr('fill', '#666');
      });
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep the node fixed at its dropped position
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Update positions on simulation tick
    simulation.nodes(nodes as any).on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x - 100},${d.y - 50})`);
    });

    // After a short time, stop the simulation
    setTimeout(() => {
      simulation.alpha(0);
      simulation.stop();
    }, 2000);

    simulation.force<d3.ForceLink<any, any>>('link')?.links(links);

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom as any);

  }, [schema]);

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
      <svg ref={svgRef} width="800" height="600" />
    </div>
  );
}
