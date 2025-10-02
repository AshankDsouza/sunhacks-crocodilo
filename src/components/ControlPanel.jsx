import { useState } from 'react';

const ControlPanel = ({ onAddNode, onDeleteNode, nodes }) => {
  const [newNodeName, setNewNodeName] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');

  const handleAddNode = () => {
    if (newNodeName.trim()) {
      onAddNode(newNodeName.trim());
      setNewNodeName('');
    }
  };

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      onDeleteNode(selectedNodeId);
      setSelectedNodeId('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNode();
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '12px',
      minWidth: '250px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #e0e0e0'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
        Simulation Builder
      </h4>
      
      {/* Add Node Section */}
      <div style={{ marginBottom: '16px' }}>
        <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Add Generator Node
        </h5>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Node name..."
            style={{
              flex: 1,
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <button
            onClick={handleAddNode}
            disabled={!newNodeName.trim()}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: newNodeName.trim() ? '#4caf50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: newNodeName.trim() ? 'pointer' : 'not-allowed',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
            title="Add Generator Node"
          >
            +
          </button>
        </div>
      </div>

      {/* Delete Node Section */}
      <div style={{ marginBottom: '16px' }}>
        <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Delete Generator Node
        </h5>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="">Select node to delete...</option>
            {nodes.filter(node => node.type === 'generator').map(node => (
              <option key={node.id} value={node.id}>
                {node.data.label} ({node.id})
              </option>
            ))}
          </select>
          <button
            onClick={handleDeleteNode}
            disabled={!selectedNodeId}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: selectedNodeId ? '#f44336' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedNodeId ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
            title="Delete Selected Node"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Node Count */}
      <div style={{ 
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666'
      }}>
        <strong>Total Generators:</strong> {nodes.filter(node => node.type === 'generator').length}
      </div>
    </div>
  );
};

export default ControlPanel;
