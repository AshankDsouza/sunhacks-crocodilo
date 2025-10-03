const ControlPanel = ({ onRun, onRefreshProject }) => {
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
        Control Panel
      </h4>
      
      {/* Run Section */}
      <div style={{ marginBottom: '16px' }}>
        <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Simulation Control
        </h5>
        <button
          onClick={onRun}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
            marginBottom: '8px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
          title="Start simulation by setting Generator1.data.step = true"
        >
          ▶ Run
        </button>
        
        <button
          onClick={onRefreshProject}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
          title="Refresh project data from database"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
