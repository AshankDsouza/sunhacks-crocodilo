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

  // Handle animation completion by reverting edge back to normal
  const handleAnimationComplete = useCallback((edgeId) => {
    console.log(`Animation completed for edge: ${edgeId}`);
    
    setEdges(prevEdges => 
      prevEdges.map(edge => 
        edge.id === edgeId 
          ? { 
              ...edge, 
              type: undefined, // Revert to default edge type
              data: { ...edge.data, onAnimationComplete: undefined }
            }
          : edge
      )
    );
  }, []);

  // Handle step completion by change the edge to the custom animated edge
  const handleStepComplete = useCallback((generatorId, job) => {
    console.log(`Step completed for ${generatorId}:`, job);

    // Change edge to animated custom edge
    setEdges(prevEdges => 
      prevEdges.map(edge => 
        edge.source === generatorId 
          ? { 
              ...edge, 
              type: 'custom',
              data: { 
                ...edge.data,
                onAnimationComplete: handleAnimationComplete 
              }
            }
          : edge
      )
    );
  }, [handleAnimationComplete]);

  // Handle run action - sets Generator1.data.step = true
  const handleRun = useCallback(() => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === 'gen1' 
          ? { ...node, data: { ...node.data, step: true } }
          : node
      )
    );
    // Reset step to false after a short delay to allow for next steps
    setTimeout(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === 'gen1' 
            ? { ...node, data: { ...node.data, step: false } }
            : node
        )
      );
    }, 100); // Adjust delay as needed
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

  // Handle node property updates from the modal
  const handleUpdateNodeData = useCallback((nodeId, updatedData) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
  }, []);

  // Update nodes to include the label update callback and modal handler
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onUpdateLabel: handleUpdateNodeLabel,
      onOpenModal: handleOpenModal,
      onStepComplete: handleStepComplete
    }
  }));

  // Get current editing node data
  const editingNodeData = editingNodeId ? nodes.find(node => node.id === editingNodeId)?.data : null;

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
        onRun={handleRun}
      />
      
      {/* Global Modal */}
      <BlankPopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        nodeId={editingNodeId}
        nodeData={editingNodeData}
        onUpdateNodeData={handleUpdateNodeData}
      />
    </div>
  );
}