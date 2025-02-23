# Use the official Node.js image from the Docker Hub
FROM node:18

# Create and set the working directory inside the container
WORKDIR /usr/src/product-service

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy the rest of the application code to the working directory
COPY . .


# Copy the .env file
COPY .env .env

# Expose the port
EXPOSE 6000

# Command to run the application
CMD ["node", "index.js"]
