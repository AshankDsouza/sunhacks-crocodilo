const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, testConnection } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
testConnection();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simulation Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'DEVS Simulation Backend API',
    version: '1.0.0',
    endpoints: [
      'GET /health - Health check',
      'GET /project/:projectId - Get project with nodes and edges'
    ]
  });
});

// GET /project/:projectId - Get project with all nodes and edges
app.get('/project/:projectId', async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Get project details
    const projectQuery = 'SELECT * FROM projects WHERE id = $1';
    const projectResult = await pool.query(projectQuery, [projectId]);
    
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get nodes for this project
    const nodesQuery = 'SELECT * FROM nodes WHERE project_id = $1 ORDER BY id';
    const nodesResult = await pool.query(nodesQuery, [projectId]);

    // Get edges for this project
    const edgesQuery = `
      SELECT e.*, 
             n1.label as source_label, 
             n2.label as target_label
      FROM edges e
      LEFT JOIN nodes n1 ON e.source_node_id = n1.id
      LEFT JOIN nodes n2 ON e.target_node_id = n2.id
      WHERE e.project_id = $1 
      ORDER BY e.id
    `;
    const edgesResult = await pool.query(edgesQuery, [projectId]);

    // Combine all data
    const response = {
      project: projectResult.rows[0],
      nodes: nodesResult.rows,
      edges: edgesResult.rows,
      counts: {
        total_nodes: nodesResult.rows.length,
        total_edges: edgesResult.rows.length
      }
    };

    res.json(response);
    
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});