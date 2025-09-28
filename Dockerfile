
# make image for nodejs app
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
# docker build -t nodejs-app .
# docker run -p 3000:3000 nodejs-app