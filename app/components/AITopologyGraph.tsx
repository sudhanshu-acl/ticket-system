'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'User Reports Issue' },
    position: { x: 250, y: 0 },
    style: { background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '2',
    data: { label: 'Ticket Creation (System)' },
    position: { x: 250, y: 100 },
    style: { background: '#f1f5f9', border: '1px solid #94a3b8', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '3',
    data: { label: 'AI Analysis Engine' },
    position: { x: 250, y: 200 },
    style: { background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '8px', padding: '15px', fontWeight: 'bold', color: '#1d4ed8' },
  },
  {
    id: '4',
    data: { label: 'Automated Resolution / FAQ' },
    position: { x: 50, y: 300 },
    style: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '5',
    data: { label: 'Auto-Triage & Categorization' },
    position: { x: 450, y: 300 },
    style: { background: '#fdf4ff', border: '1px solid #f0abfc', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '6',
    data: { label: 'Human Agent Assignment' },
    position: { x: 450, y: 400 },
    style: { background: '#fffbeb', border: '1px solid #fde047', borderRadius: '8px', padding: '10px' },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Resolution & Closure' },
    position: { x: 250, y: 500 },
    style: { background: '#f0fdf4', border: '1px solid #4ade80', borderRadius: '8px', padding: '10px', fontWeight: 'bold' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, label: 'High Confidence', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-5', source: '3', target: '5', animated: true, label: 'Needs Human', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-7', source: '4', target: '7', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: '5', target: '6', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6-7', source: '6', target: '7', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function AITopologyGraph({ ticket }: { ticket?: any }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    if (!ticket) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      return;
    }

    const activeStatus = ticket.status; // 'Open', 'In Progress', 'Resolved', 'Closed'
    
    // Define active paths based on status
    let activeNodeIds = ['1', '2']; // Always active at start
    let activeEdgeIds = ['e1-2'];

    if (activeStatus === 'Open') {
      activeNodeIds = ['1', '2', '3'];
      activeEdgeIds = ['e1-2', 'e2-3'];
    } else if (activeStatus === 'In Progress') {
      activeNodeIds = ['1', '2', '3', '5', '6'];
      activeEdgeIds = ['e1-2', 'e2-3', 'e3-5', 'e5-6'];
    } else if (activeStatus === 'Resolved' || activeStatus === 'Closed') {
      activeNodeIds = ['1', '2', '3', '5', '6', '7'];
      activeEdgeIds = ['e1-2', 'e2-3', 'e3-5', 'e5-6', 'e6-7'];
    }

    // Update nodes
    const updatedNodes = initialNodes.map((n) => {
      const isActive = activeNodeIds.includes(n.id);
      const isCurrentStep = activeNodeIds[activeNodeIds.length - 1] === n.id;
      
      let background = isActive ? '#dbeafe' : '#f8fafc'; // blue-100 if active
      let border = isActive ? '2px solid #3b82f6' : '1px solid #cbd5e1';
      
      if (isCurrentStep) {
        background = '#bfdbfe'; // darker blue-200
        border = '2px solid #2563eb';
      }

      // If resolved, make the end node green
      if (isCurrentStep && (activeStatus === 'Resolved' || activeStatus === 'Closed')) {
         background = '#bbf7d0'; // green-200
         border = '2px solid #16a34a';
      }

      return {
        ...n,
        style: { ...n.style, background, border, opacity: isActive ? 1 : 0.5 },
      };
    });

    // Update edges
    const updatedEdges = initialEdges.map((e) => {
      const isActive = activeEdgeIds.includes(e.id);
      return {
        ...e,
        animated: isActive,
        style: {
          ...e.style,
          stroke: isActive ? '#3b82f6' : '#cbd5e1',
          strokeWidth: isActive ? 2 : 1,
        },
      };
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [ticket, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-full min-h-[600px] border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
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
