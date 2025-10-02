import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import components
import GeneratorNode from './components/GeneratorNode';
import CustomEdge from './components/CustomEdge';
import InstructionsPanel from './components/InstructionsPanel';
import ControlPanel from './components/ControlPanel';
import BlankPopup from './components/BlankPopup';

// Import initial data
import { initialNodes, initialEdges } from './data/flowData';

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeCounter, setNodeCounter] = useState(3); // Start from 3 since we have gen1 and gen2
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
    []
  );

  // Add new generator node
  const handleAddNode = useCallback((nodeName) => {
    const newNodeId = `gen${nodeCounter}`;
    const newNode = {
      id: newNodeId,
      type: 'generator',
      position: {
        x: 50 + (nodeCounter - 1) * 150, // Space them out horizontally
        y: 100 + ((nodeCounter - 1) % 3) * 150 // Create rows of 3
      },
      data: { 
        label: nodeName
      }
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setNodeCounter(prev => prev + 1);
  }, [nodeCounter]);

  // Delete generator node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setEdges(prevEdges => prevEdges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, []);

  // Update node label
  const handleUpdateNodeLabel = useCallback((nodeId, newLabel) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  }, []);

  // Modal handlers
  const handleOpenModal = useCallback((nodeId) => {
    setEditingNodeId(nodeId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingNodeId(null);
  }, []);

  // Update nodes to include the label update callback and modal handler
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onUpdateLabel: handleUpdateNodeLabel,
      onOpenModal: handleOpenModal
    }
  }));

  // Define custom edge and node types
  const edgeTypes = {
    custom: CustomEdge,
  };

  const nodeTypes = {
    generator: GeneratorNode,
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
      />
      
      <InstructionsPanel />
      <ControlPanel 
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        nodes={nodes}
      />
      
      {/* Global Modal */}
      <BlankPopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        nodeId={editingNodeId}
      />
    </div>
  );
}