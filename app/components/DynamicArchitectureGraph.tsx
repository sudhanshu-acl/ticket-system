'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, align: 'UL', nodesep: 100, edgesep: 50, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      // Shift the dagre node position (anchor=center) to the top left
      // so it matches the React Flow node anchor point
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes as Node[], edges };
};

interface DynamicArchitectureGraphProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export default function DynamicArchitectureGraph({ initialNodes, initialEdges }: DynamicArchitectureGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Apply layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layoutedNodes as []);
    setEdges(layoutedEdges as []);
    setIsReady(true);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  if (!isReady) {
    return <div className="flex justify-center items-center h-[700px] text-gray-500">Calculating layout...</div>;
  }

  return (
    <div className="w-full h-full min-h-[700px] border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
