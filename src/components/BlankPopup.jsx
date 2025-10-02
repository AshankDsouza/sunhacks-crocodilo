import React, { useEffect } from 'react';

const BlankPopup = ({ isOpen, onClose, nodeId }) => {
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

        {/* Content Area - Full screen blank canvas */}
        <div style={{
          flex: 1,
          padding: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#ccc',
            fontSize: '28px',
            userSelect: 'none'
          }}>
            <div style={{ 
              fontSize: '120px', 
              marginBottom: '30px',
              opacity: 0.3 
            }}>
              📝
            </div>
            <h2 style={{ 
              color: '#999', 
              fontWeight: 'normal',
              fontSize: '32px',
              marginBottom: '15px'
            }}>
              Blank Canvas
            </h2>
            <p style={{ 
              fontSize: '18px',
              color: '#bbb',
              margin: '0'
            }}>
              Node: <strong style={{ color: '#666' }}>{nodeId}</strong>
            </p>
            <p style={{ 
              marginTop: '20px', 
              fontSize: '16px',
              color: '#ccc',
              fontStyle: 'italic'
            }}>
              Ready for your content...
            </p>
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
            Full-screen editor for node configuration
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
              onClick={onClose}
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
