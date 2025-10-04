#!/bin/bash

# Build script for production deployment with nginx reverse proxy

echo "Building React frontend..."
npm run build

echo "Building Docker containers..."
docker-compose build

echo "Starting services with nginx reverse proxy..."
docker-compose up -d

echo "Services started:"
echo "- Frontend: Available through nginx proxy"
echo "- Backend API: Available at https://cocodrilo.me/api"
echo "- Database: Internal network only"
echo "- Nginx: Listening on ports 80 and 443"

echo ""
echo "Your app should be available at:"
echo "- https://cocodrilo.me (main site)"
echo "- https://cocodrilo.me/api/project/1 (API endpoint)"