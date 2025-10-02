const InstructionsPanel = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 8px 0' }}>Generator Simulation</h4>
      <ul style={{ margin: 0, paddingLeft: '16px' }}>
        <li>Each node is a generator with phases</li>
        <li>Dots continuously animate along edges</li>
        <li>Click "Start" to begin job generation</li>
        <li>Click "Stop" to halt generation</li>
        <li>Border color shows current phase</li>
        <li>Job counter increases when active</li>
      </ul>
    </div>
  );
};

export default InstructionsPanel;
