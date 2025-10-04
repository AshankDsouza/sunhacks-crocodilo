import { useState, useEffect } from 'react';

const ExternalEventPopup = ({ isOpen, onClose, onAddEvent, nodeId }) => {
  const [eventValue, setEventValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEventValue('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const value = parseInt(eventValue);
    if (!isNaN(value)) {
      onAddEvent(value);
      onClose();
    } else {
      alert('Please enter a valid integer value');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e0e0e0',
        minWidth: '300px'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            color: '#333',
            fontSize: '18px'
          }}>
            Add External Event
          </h3>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '14px'
          }}>
            Node: {nodeId}
          </p>
        </div>

        {/* Input Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            Event Value (Integer):
          </label>
          <input
            type="number"
            value={eventValue}
            onChange={(e) => setEventValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter integer value"
            autoFocus
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007acc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalEventPopup;