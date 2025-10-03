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
      'GET /project/:projectId - Get project with nodes and edges',
      'PUT /project/:projectId - Update project with nodes and edges'
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

// PUT /project/:projectId - Update project with nodes and edges
app.put('/project/:projectId', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const projectId = parseInt(req.params.projectId);
    const { nodes, edges } = req.body;
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    if (!nodes || !edges) {
      return res.status(400).json({ error: 'Missing nodes or edges data' });
    }

    await client.query('BEGIN');

    // Check if project exists
    const projectCheck = await client.query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Project not found' });
    }

    // Clear existing nodes and edges (CASCADE will handle relationships)
    await client.query('DELETE FROM nodes WHERE project_id = $1', [projectId]);
    await client.query('DELETE FROM edges WHERE project_id = $1', [projectId]);

    // Insert new nodes
    const insertedNodes = [];
    for (const node of nodes) {
      const nodeQuery = `
        INSERT INTO nodes (project_id, label, processing_time, type)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const nodeResult = await client.query(nodeQuery, [
        projectId,
        node.label || 'Untitled Node', // Dummy label if missing
        node.processing_time || 10,    // Dummy processing time if missing
        node.node_type || 'generator'  // Dummy type if missing
      ]);
      insertedNodes.push(nodeResult.rows[0]);
    }

    // Create mapping from old node IDs to new node IDs for edges
    const nodeIdMapping = {};
    nodes.forEach((originalNode, index) => {
      if (originalNode.id) {
        nodeIdMapping[originalNode.id] = insertedNodes[index].id;
      }
    });

    // Also map by label for nodes that don't have IDs (new nodes)
    nodes.forEach((originalNode, index) => {
      nodeIdMapping[originalNode.label] = insertedNodes[index].id;
    });

    // Insert new edges
    const insertedEdges = [];
    for (const edge of edges) {
      // Find the actual node IDs from our inserted nodes
      let sourceNodeId = edge.source_node_id;
      let targetNodeId = edge.target_node_id;

      // If we can't find by ID, try to find by matching with inserted nodes
      if (!sourceNodeId || !nodeIdMapping[sourceNodeId]) {
        const sourceNode = insertedNodes.find(n => n.label === edge.source_label);
        sourceNodeId = sourceNode ? sourceNode.id : null;
      } else {
        sourceNodeId = nodeIdMapping[sourceNodeId];
      }

      if (!targetNodeId || !nodeIdMapping[targetNodeId]) {
        const targetNode = insertedNodes.find(n => n.label === edge.target_label);
        targetNodeId = targetNode ? targetNode.id : null;
      } else {
        targetNodeId = nodeIdMapping[targetNodeId];
      }

      if (sourceNodeId && targetNodeId) {
        const edgeQuery = `
          INSERT INTO edges (project_id, source_node_id, target_node_id)
          VALUES ($1, $2, $3)
          RETURNING *
        `;
        const edgeResult = await client.query(edgeQuery, [
          projectId,
          sourceNodeId,
          targetNodeId
        ]);
        insertedEdges.push(edgeResult.rows[0]);
      }
    }

    // Update project's updated_at timestamp
    await client.query(
      'UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [projectId]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Project updated successfully',
      project_id: projectId,
      nodes_count: insertedNodes.length,
      edges_count: insertedEdges.length,
      nodes: insertedNodes,
      edges: insertedEdges
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  } finally {
    client.release();
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});