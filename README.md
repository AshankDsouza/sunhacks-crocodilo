# React + Vite
sudo docker build -t nodejs-app .
sudo docker stop nodejs-app || true
sudo docker rm nodejs-app || true
sudo docker run  -p 3000:3000 --name nodejs-app nodejs-app

