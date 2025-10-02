import { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { SimulationGenerator } from './Generator';

const GeneratorNode = ({ id, data, isConnectable }) => {
  const [generator] = useState(() => new SimulationGenerator(data.label, 2000));
  const [phase, setPhase] = useState('passive');
  const [count, setCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);

  useEffect(() => {
    generator.setCallback('onPhaseChange', (newPhase) => {
      console.log(`Generator ${id} phase changed to:`, newPhase);
      setPhase(newPhase);
    });

    generator.setCallback('onOutput', (output) => {
      console.log(`Generator ${id} produced output:`, output);
      setCount(output.id.replace('job', ''));
      // Trigger animation when output is generated
      if (data.onOutput) {
        console.log(`Calling onOutput callback for ${id}`);
        data.onOutput(id);
      }
    });

    generator.initialize();
  }, [generator, id, data]);

  useEffect(() => {
    setEditLabel(data.label);
  }, [data.label]);

  const handleStart = () => {
    generator.start();
  };

  const handleStop = () => {
    generator.stop();
  };

  const handleLabelEdit = () => {
    setIsEditing(true);
  };

  const handleLabelSubmit = () => {
    if (editLabel.trim() && data.onUpdateLabel) {
      data.onUpdateLabel(id, editLabel.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    } else if (e.key === 'Escape') {
      setEditLabel(data.label);
      setIsEditing(false);
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'active': return '#4caf50';
      case 'passive': return '#9e9e9e';
      case 'finishing': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{
      padding: '12px',
      background: '#fff',
      border: `3px solid ${getPhaseColor()}`,
      borderRadius: '8px',
      minWidth: '120px',
      textAlign: 'center',
      fontSize: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: '#555' }}
      />
      
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        {isEditing ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyPress={handleKeyPress}
            autoFocus
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              border: '1px solid #4caf50',
              borderRadius: '3px',
              padding: '2px 4px',
              width: '100%',
              textAlign: 'center'
            }}
          />
        ) : (
          <div 
            onClick={handleLabelEdit}
            style={{ cursor: 'pointer' }}
            title="Click to edit name"
          >
            {data.label}
          </div>
        )}
      </div>
      
      <div style={{ 
        fontSize: '10px', 
        marginBottom: '8px',
        color: getPhaseColor(),
        fontWeight: 'bold'
      }}>
        {phase.toUpperCase()}
      </div>
      
      <div style={{ fontSize: '10px', marginBottom: '8px' }}>
        Jobs: {count}
      </div>
      
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '4px' }}>
        <button 
          onClick={handleStart}
          disabled={phase === 'active'}
          style={{
            fontSize: '9px',
            padding: '2px 6px',
            backgroundColor: phase === 'active' ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: phase === 'active' ? 'not-allowed' : 'pointer'
          }}
        >
          Start
        </button>
        <button 
          onClick={handleStop}
          disabled={phase !== 'active'}
          style={{
            fontSize: '9px',
            padding: '2px 6px',
            backgroundColor: phase !== 'active' ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: phase !== 'active' ? 'not-allowed' : 'pointer'
          }}
        >
          Stop
        </button>
      </div>

      {/* Edit Icon */}
      <div style={{ 
        position: 'absolute', 
        top: '4px', 
        right: '4px',
        cursor: 'pointer'
      }}>
        <button 
          onClick={() => data.onOpenModal(id)}
          style={{
            fontSize: '12px',
            padding: '4px',
            backgroundColor: 'transparent',
            color: '#666',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Edit Node"
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#f0f0f0';
            e.target.style.color = '#333';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#666';
          }}
        >
          ✏️
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default GeneratorNode;
