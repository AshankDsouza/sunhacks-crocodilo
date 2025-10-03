export default function NodeCreationPanel({ onCreateNode }) {
  // Generate random node names
  const generateRandomNodeName = () => {
    const prefixes = ['Gen', 'Proc', 'Node', 'Unit', 'Block'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomPrefix}${randomNumber}`;
  };

  const handleCreateNode = () => {
    // Create a new node with random name and position
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'generator',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100
      },
      data: {
        label: generateRandomNodeName(),
        processingTime: 10,
        jobQueue: [],
        step: false
      }
    };

    onCreateNode(newNode);
  };

  const handleSaveProject = () => {
    // Dummy non-functional save project button
    alert('Save Project functionality - Coming Soon!');
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '150px',
      right: '20px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      width: '200px', // Same width as control panel
      zIndex: 1000
    }}>
      {/* Plus button that spans entire width */}
      <button
        onClick={handleCreateNode}
        style={{
          width: '100%',
          background: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
          fontWeight: 'bold'
        }}
      >
        + Add Node
      </button>
      
      {/* Dummy Save Project button */}
      <button
        onClick={handleSaveProject}
        style={{
          width: '100%',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        💾 Save Project
      </button>
    </div>
  );
}
