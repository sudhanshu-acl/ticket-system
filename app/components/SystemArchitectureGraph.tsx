'use client';

import React, { useCallback } from 'react';
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
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  // Client Layer
  {
    id: 'browser',
    type: 'input',
    data: { label: '🌐 Web Browser (Client)' },
    position: { x: 300, y: 0 },
    style: { background: '#f1f5f9', border: '2px solid #64748b', borderRadius: '8px', padding: '10px', width: 250 },
  },
  {
    id: 'page',
    data: { label: '📄 app/[route]/page.tsx\n(Frontend Route)' },
    position: { x: 150, y: 150 },
    style: { background: '#dbeafe', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', width: 250, color: '#1e3a8a' },
  },
  {
    id: 'component',
    data: { label: '🧩 app/components/*.tsx\n(UI Components)' },
    position: { x: 450, y: 150 },
    style: { background: '#dbeafe', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', width: 250, color: '#1e3a8a' },
  },
  
  // Bridge
  {
    id: 'action',
    data: { label: '⚡ app/actions/*.ts\n(Server Actions)' },
    position: { x: 300, y: 300 },
    style: { background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '8px', padding: '10px', width: 250, color: '#92400e' },
  },

  // Server Layer
  {
    id: 'api',
    data: { label: '🛣️ app/api/[route]/route.ts\n(API Endpoints)' },
    position: { x: 300, y: 450 },
    style: { background: '#dcfce7', border: '2px solid #22c55e', borderRadius: '8px', padding: '10px', width: 250, color: '#14532d' },
  },
  {
    id: 'auth',
    data: { label: '🛡️ app/lib/auth.ts\n(Authentication)' },
    position: { x: 50, y: 450 },
    style: { background: '#dcfce7', border: '2px solid #22c55e', borderRadius: '8px', padding: '10px', width: 200, color: '#14532d' },
  },
  {
    id: 'perms',
    data: { label: '🔑 app/lib/permissions.ts\n(Authorization)' },
    position: { x: 600, y: 450 },
    style: { background: '#dcfce7', border: '2px solid #22c55e', borderRadius: '8px', padding: '10px', width: 200, color: '#14532d' },
  },

  // Data Layer
  {
    id: 'model',
    data: { label: '📦 app/models/*.ts\n(Mongoose Schemas)' },
    position: { x: 150, y: 600 },
    style: { background: '#f3e8ff', border: '2px solid #a855f7', borderRadius: '8px', padding: '10px', width: 250, color: '#581c87' },
  },
  {
    id: 'mongoLib',
    data: { label: '🔌 app/lib/mongodb.ts\n(DB Connection)' },
    position: { x: 450, y: 600 },
    style: { background: '#f3e8ff', border: '2px solid #a855f7', borderRadius: '8px', padding: '10px', width: 250, color: '#581c87' },
  },
  {
    id: 'mongodb',
    type: 'output',
    data: { label: '🍃 MongoDB Database' },
    position: { x: 300, y: 750 },
    style: { background: '#f1f5f9', border: '2px solid #64748b', borderRadius: '8px', padding: '10px', width: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-browser-page', source: 'browser', target: 'page', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-page-comp', source: 'page', target: 'component', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-comp-action', source: 'component', target: 'action', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, label: 'fetch()' },
  { id: 'e-page-action', source: 'page', target: 'action', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, label: 'fetch()' },
  
  { id: 'e-action-api', source: 'action', target: 'api', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, label: 'HTTP Request' },
  
  { id: 'e-api-auth', source: 'api', target: 'auth', animated: false, style: { strokeDasharray: '5 5' } },
  { id: 'e-api-perms', source: 'api', target: 'perms', animated: false, style: { strokeDasharray: '5 5' } },
  
  { id: 'e-api-model', source: 'api', target: 'model', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, label: 'Query' },
  { id: 'e-api-mongoLib', source: 'api', target: 'mongoLib', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, label: 'Connect' },
  
  { id: 'e-model-mongo', source: 'model', target: 'mongodb', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, label: 'I/O' },
  { id: 'e-mongoLib-mongo', source: 'mongoLib', target: 'mongodb', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function SystemArchitectureGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

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
