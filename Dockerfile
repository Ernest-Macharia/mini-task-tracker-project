# Use an official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose Vite dev server port
EXPOSE 8080

# Start the dev server
CMD ["npm", "run", "dev"]
