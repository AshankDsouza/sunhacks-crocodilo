import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import components
import GeneratorNode from './components/GeneratorNode';
import CustomEdge from './components/CustomEdge';
import InstructionsPanel from './components/InstructionsPanel';
import ControlPanel from './components/ControlPanel';
import NodeCreationPanel from './components/NodeCreationPanel';
import BlankPopup from './components/BlankPopup';

// Import initial data
import { initialNodes, initialEdges } from './data/flowData';

const backendUrl = 'http://20.163.14.54:4001';

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState(null);

  // Convert database nodes to React Flow nodes
  const convertDatabaseNodesToReactFlow = (dbNodes) => {
    return dbNodes.map((dbNode, index) => ({
      id: `node-${dbNode.id}`,
      type: 'generator', // For now, all nodes are generators
      position: { 
        x: 100 + (index * 200), // Spread nodes horizontally
        y: 100 + (index % 3) * 100 // Create rows every 3 nodes
      },
      data: {
        label: dbNode.label,
        processingTime: dbNode.processing_time || 10,
        jobQueue: [],
        step: false
      }
    }));
  };

  // Convert database edges to React Flow edges
  const convertDatabaseEdgesToReactFlow = (dbEdges) => {
    return dbEdges.map((dbEdge) => ({
      id: `edge-${dbEdge.id}`,
      source: `node-${dbEdge.source_node_id}`,
      target: `node-${dbEdge.target_node_id}`,
      type: 'normal',
      style: { stroke: '#555', strokeWidth: 2 }
    }));
  };

  // Fetch project data from backend
  const fetchProjectData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/project/1`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProjectData(data);
      
      // Convert and set nodes and edges
      const reactFlowNodes = convertDatabaseNodesToReactFlow(data.nodes);
      const reactFlowEdges = convertDatabaseEdgesToReactFlow(data.edges);
      
      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
      
      console.log('Project loaded:', data.project.name);
      console.log('Nodes loaded:', reactFlowNodes.length);
      console.log('Edges loaded:', reactFlowEdges.length);
      
    } catch (error) {
      console.error('Error fetching project data:', error);
      // Fall back to initial static data
      setNodes(initialNodes);
      setEdges(initialEdges);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load project data on component mount
  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

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

  // Handle creating new nodes
  const handleCreateNode = useCallback((newNode) => {
    setNodes(prevNodes => [...prevNodes, newNode]);
  }, []);

  // Convert React Flow nodes to database format
  const convertNodesToDatabase = (reactFlowNodes) => {
    return reactFlowNodes.map(node => ({
      id: parseInt(node.id.replace('node-', '')) || null, // Extract ID or null for new nodes
      label: node.data.label || 'Untitled Node',         // Dummy label if missing
      processing_time: node.data.processingTime || 10,   // Dummy processing time if missing
      node_type: node.type || 'generator'                // Dummy type if missing
    }));
  };

  // Convert React Flow edges to database format
  const convertEdgesToDatabase = (reactFlowEdges) => {
    return reactFlowEdges.map(edge => ({
      id: parseInt(edge.id.replace('edge-', '')) || null, // Extract ID or null for new edges
      source_node_id: parseInt(edge.source.replace('node-', '')) || null, // Dummy null if parsing fails
      target_node_id: parseInt(edge.target.replace('node-', '')) || null,  // Dummy null if parsing fails
      edge_type: edge.type || 'normal'  // Dummy type if missing (though we're not saving this)
    }));
  };

  // Handle saving the project
  const handleSaveProject = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const projectId = 1; // For now, we're working with project ID 1
      
      // Convert current state to database format
      const dbNodes = convertNodesToDatabase(nodes);
      const dbEdges = convertEdgesToDatabase(edges);
      
      const payload = {
        nodes: dbNodes,
        edges: dbEdges
      };

      console.log('Saving project with payload:', payload);

      const response = await fetch(`${backendUrl}/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to save project: ${response.status}`);
      }

      const result = await response.json();
      console.log('Project saved successfully:', result);
      
      // Refresh the project data to reflect the saved state
      await fetchProjectData();
      
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Failed to save project: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [nodes, edges, fetchProjectData]);

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
      {isLoading ? (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Project...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Fetching data from backend</div>
        </div>
      ) : null}
      
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
      
      {/* Project Info Panel */}
      {projectData && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '250px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
            📊 {projectData.project.name}
          </h4>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
            {projectData.project.description}
          </div>
          <div style={{ fontSize: '11px' }}>
            <div>📦 Nodes: {projectData.counts.total_nodes}</div>
            <div>🔗 Edges: {projectData.counts.total_edges}</div>
            <div style={{ marginTop: '4px', fontSize: '10px', color: '#888' }}>
              Loaded from database
            </div>
          </div>
        </div>
      )}
      
      <InstructionsPanel />
      <ControlPanel 
        onRun={handleRun}
        onRefreshProject={fetchProjectData}
      />
      <NodeCreationPanel 
        onCreateNode={handleCreateNode} 
        onSaveProject={handleSaveProject}
        isLoading={isLoading}
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