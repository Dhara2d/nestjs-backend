import React, { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

// Initial nodes configuration with a hierarchical, parent-child relationship
const initialNodes = [
  // Parent Node: VPC
  {
    id: 'vpc',
    type: 'default',
    data: { label: 'VPC: 10.0.0.0/16' },
    position: { x: 250, y: 50 }, // Position the VPC at the top
    style: { backgroundColor: '#f2f2f2', border: '1px solid #ddd' },
  },

  // Child Node 1: Frontend Subnet (inside VPC)
  {
    id: 'frontendSubnet',
    type: 'default',
    data: { label: 'Frontend Subnet: 10.0.1.0/24' },
    position: { x: 100, y: 150 }, // Positioned under VPC
    style: { backgroundColor: '#f2f2f2', border: '1px solid #ddd' },
  },

  // Child Node 2: Backend Subnet (inside VPC)
  {
    id: 'backendSubnet',
    type: 'default',
    data: { label: 'Backend Subnet: 10.0.2.0/24' },
    position: { x: 400, y: 150 }, // Positioned under VPC but on the right side
    style: { backgroundColor: '#f2f2f2', border: '1px solid #ddd' },
  },

  // Child Node 1.1: Frontend EC2 (inside Frontend Subnet)
  {
    id: 'frontendEC2',
    type: 'default',
    data: { label: 'Frontend EC2' },
    position: { x: 100, y: 250 }, // Positioned under Frontend Subnet
    style: { backgroundColor: '#f9e0e0', border: '1px solid #dd2222' },
  },

  // Child Node 2.1: Backend EC2 (inside Backend Subnet)
  {
    id: 'backendEC2',
    type: 'default',
    data: { label: 'Backend EC2' },
    position: { x: 400, y: 250 }, // Positioned under Backend Subnet
    style: { backgroundColor: '#f9e0e0', border: '1px solid #dd2222' },
  },

  // Parent Node 2: Internet Gateway (attached to VPC)
  {
    id: 'internetGateway',
    type: 'default',
    data: { label: 'Internet Gateway' },
    position: { x: 250, y: 350 }, // Positioned below VPC
    style: { backgroundColor: '#e0f7fa', border: '1px solid #00bcd4' },
  },
];

const FlowDiagram = () => {
  const [nodes, setNodes] = useState(initialNodes);

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={(changes) => setNodes(changes)}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowDiagram;
