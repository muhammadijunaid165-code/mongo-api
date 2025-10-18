# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production || npm install --omit=dev
COPY src ./src
ENV PORT=5000
EXPOSE 5000
CMD ["node", "src/index.js"]
