-- Create emails table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nodes table
CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    processing_time INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create edges table
CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    source_node_id INT REFERENCES nodes(id) ON DELETE CASCADE,
    target_node_id INT REFERENCES nodes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data, single sample project
INSERT INTO projects (name, description) VALUES ('Sample Project', 'This is a sample project.');

-- Insert sample nodes
INSERT INTO nodes (project_id, label, type, processing_time) VALUES
(1, 'Input Node', 'input', 5),
(1, 'Processing Node', 'processing', 10),
(1, 'Output Node', 'output', 2);

-- Insert sample edges
INSERT INTO edges (project_id, source_node_id, target_node_id) VALUES
(1, 1, 2),
(1, 2, 3);  