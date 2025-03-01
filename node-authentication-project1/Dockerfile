# Use the official Node.js 18 image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/node/

# Copy package.json and package-lock.json before running npm install (Optimized Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the .env file
COPY .env .env

# Expose the port (Ensure this matches the port in your app)
EXPOSE 6767

# Command to run the application
CMD ["node", "index.js"]
