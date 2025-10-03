# Backend Testing Instructions

## 🚀 Quick Start

1. **Build and run everything:**
   ```bash
   docker-compose up --build
   ```

2. **Test the backend API:**
   
   **Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```
   
   **API Info:**
   ```bash
   curl http://localhost:5000/
   ```
   
   **Get Sample Project (ID=1):**
   ```bash
   curl http://localhost:5000/project/1
   ```

## 📊 Expected Response for Project API

```json
{
  "project": {
    "id": 1,
    "name": "Sample Project",
    "description": "This is a sample project.",
    "created_at": "2025-10-03T..."
  },
  "nodes": [
    {
      "id": 1,
      "project_id": 1,
      "label": "Input Node",
      "type": "input",
      "processing_time": 5,
      "created_at": "2025-10-03T..."
    },
    // ... more nodes
  ],
  "edges": [
    {
      "id": 1,
      "project_id": 1,
      "source_node_id": 1,
      "target_node_id": 2,
      "source_label": "Input Node",
      "target_label": "Processing Node",
      "created_at": "2025-10-03T..."
    },
    // ... more edges
  ],
  "counts": {
    "total_nodes": 3,
    "total_edges": 2
  }
}
```

## 🔍 Service URLs

- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:5000
- **Database:** localhost:5432 (simdb/postgres/postgres)

## 🐛 Troubleshooting

If you get connection errors:
1. Wait a few seconds for database to initialize
2. Check logs: `docker-compose logs backend`
3. Check database: `docker-compose logs db`