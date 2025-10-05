import React, { useState, useEffect } from 'react';

const BlankPopup = ({ isOpen, onClose, nodeId, nodeData, onUpdateNodeData }) => {
  const [formData, setFormData] = useState({
    label: '',
    processingTime: 10,
    nodeType: 'normal', // Change default to normal
    jobQueue: [],
    inports: [],
    outports: []
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && nodeData) {
      setFormData({
        label: nodeData.label || '',
        processingTime: nodeData.processingTime || 10,
        nodeType: nodeData.nodeType || 'normal', // Change default to normal
        jobQueue: nodeData.jobQueue || [],
        inports: nodeData.inports || ['input'],
        outports: nodeData.outports || ['output']
      });
    }
  }, [isOpen, nodeData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onUpdateNodeData && nodeId) {
      onUpdateNodeData(nodeId, formData);
    }
    onClose();
  };

  const addPort = (portType) => {
    const newPortName = portType === 'inports' ? `input_${formData[portType].length + 1}` : `output_${formData[portType].length + 1}`;
    setFormData(prev => ({
      ...prev,
      [portType]: [...prev[portType], newPortName]
    }));
  };

  const removePort = (portType, index) => {
    setFormData(prev => ({
      ...prev,
      [portType]: prev[portType].filter((_, i) => i !== index)
    }));
  };

  const updatePortName = (portType, index, newName) => {
    setFormData(prev => ({
      ...prev,
      [portType]: prev[portType].map((port, i) => i === index ? newName : port)
    }));
  };
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '95vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
        border: '1px solid #e0e0e0',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '2px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          minHeight: '80px'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#333', 
            fontSize: '32px', 
            fontWeight: 'bold' 
          }}>
            Edit Node - {nodeId}
          </h1>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '36px',
              cursor: 'pointer',
              color: '#666',
              padding: '8px',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#333';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#666';
            }}
          >
            ×
          </button>
        </div>

        {/* Content Area - Generator Configuration Form */}
        <div style={{
          flex: 1,
          padding: '32px',
          backgroundColor: '#ffffff',
          overflowY: 'auto'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Basic Properties Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ 
                color: '#333', 
                fontSize: '24px', 
                marginBottom: '20px',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '10px'
              }}>
                Basic Properties
              </h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold',
                    color: '#555'
                  }}>
                    Generator Name:
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => handleInputChange('label', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter generator name"
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold',
                    color: '#555'
                  }}>
                    Processing Time (ms):
                  </label>
                  <input
                    type="number"
                    value={formData.processingTime}
                    onChange={(e) => handleInputChange('processingTime', parseInt(e.target.value) || 0)}
                    style={{
                      width: '200px',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Processing time"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold',
                    color: '#555'
                  }}>
                    Node Type:
                  </label>
                  <select
                    value={formData.nodeType}
                    onChange={(e) => handleInputChange('nodeType', e.target.value)}
                    style={{
                      width: '200px',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="normal">Normal</option>
                    <option value="generator">Generator</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inports Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ 
                color: '#333', 
                fontSize: '24px', 
                marginBottom: '20px',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '10px'
              }}>
                Input Ports
              </h2>
              
              {formData.inports.map((port, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '12px' 
                }}>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => updatePortName('inports', index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="Port name"
                  />
                  <button
                    onClick={() => removePort('inports', index)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => addPort('inports')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + Add Input Port
              </button>
            </div>

            {/* Outports Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ 
                color: '#333', 
                fontSize: '24px', 
                marginBottom: '20px',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '10px'
              }}>
                Output Ports
              </h2>
              
              {formData.outports.map((port, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '12px' 
                }}>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => updatePortName('outports', index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="Port name"
                  />
                  <button
                    onClick={() => removePort('outports', index)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => addPort('outports')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + Add Output Port
              </button>
            </div>

            {/* Job Queue Display (Read-only for now) */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ 
                color: '#333', 
                fontSize: '24px', 
                marginBottom: '20px',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '10px'
              }}>
                Current Job Queue
              </h2>
              
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                {JSON.stringify(formData.jobQueue, null, 2)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px 32px',
          borderTop: '2px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          minHeight: '80px'
        }}>
          <div style={{
            color: '#666',
            fontSize: '16px'
          }}>
            Configure generator properties and ports
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '14px 28px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '14px 28px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlankPopup;
