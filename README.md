# Node.js E-Commerce Microservices API

## Overview
This project is a **Node.js E-Commerce API** built with **Express.js**, **API Gateway**, and multiple microservices (**Auth Service, Product Service, and Order Service**). The system uses **MongoDB**, **Redis Cache**, and **Docker Compose** for seamless development and deployment.

## Features
- **Microservices Architecture**
- **API Gateway** using **Express.js**
- **Authentication & Authorization**
- **Product Management**
- **Order Processing**
- **MongoDB** for database storage
- **Redis** for caching
- **Docker Compose** for easy containerized setup
- **Development & Production Configurations**

## Architecture Diagram
Below is the architecture representation of the system:

```
        ┌──────────────────────┐
        │  Client (Frontend)   │
        └────────▲────────────┘
                 │
                 ▼
        ┌───────────────────┐
        │   API Gateway     │  (Express.js)
        └────────▲──────────┘
                 │
 ┌──────────────┴──────────────┐
 │                              │
 ▼                              ▼
┌──────────────┐          ┌──────────────┐
│ Auth Service │          │ Order Service│
│  (Node.js)   │          │  (Node.js)   │
└──────────────┘          └──────────────┘
       │                         │
       ▼                         ▼
┌──────────────┐          ┌──────────────┐
│ MongoDB (Auth)│          │ MongoDB (Order)│
└──────────────┘          └──────────────┘

┌──────────────┐          ┌──────────────┐
│ Product Service │       │ Redis Cache  │
│   (Node.js)     │       │ (Session Cache) │
└──────────────┘          └──────────────┘
       │
       ▼
┌──────────────┐
│ MongoDB (Product)│
└──────────────┘
```

## Services Breakdown

### 1️⃣ **API Gateway**
- Routes requests to respective microservices.
- Manages authentication & request validation.

### 2️⃣ **Auth Service**
- User authentication & authorization.
- Token-based authentication (JWT).
- Manages user data in MongoDB.

### 3️⃣ **Product Service**
- Handles product listing & inventory.
- CRUD operations on products.

### 4️⃣ **Order Service**
- Manages order placement, processing, and tracking.
- Interacts with Product Service and Auth Service.

## Development & Deployment

### 🚀 **Development Setup (Docker Compose)**
To start the development environment, use Docker Compose:
```sh
docker-compose up --build
```

### 🚀 **Production Setup (Separate Compose Files)**
For production, we use **two separate** Docker Compose files:
```sh
docker-compose -f docker-compose-production.yml up --build
```

## Technologies Used
- **Node.js** (Backend Framework)
- **Express.js** (API Gateway & Microservices)
- **MongoDB** (Database for Auth, Product, and Order services)
- **Redis** (Cache for session storage & optimization)
- **Docker & Docker Compose** (Containerization)
- **JWT** (Authentication)

## Contributing
1. Fork the repository
2. Clone your fork
   ```sh
   git clone https://github.com/your-username/nodejs-ecommerce-microservices-api-gateway.git
   ```
3. Create a feature branch
   ```sh
   git checkout -b feature-new-feature
   ```
4. Make changes & commit
   ```sh
   git commit -m "Added new feature"
   ```
5. Push changes & create PR
   ```sh
   git push origin feature-new-feature
   ```

# Deploy Node.js API with MongoDB on AWS EC2 using Docker

This guide provides step-by-step instructions to deploy a **Node.js CRUD API with MongoDB** using **Docker and Docker-Compose** on an **AWS EC2** instance.

---

## **1. Setup AWS EC2 Instance**

### **1️⃣ Launch EC2 Instance**
1. Go to **AWS Console → EC2 → Launch Instance**.
2. Select **Ubuntu 22.04** as the OS.
3. Choose an instance type:
   - **t2.micro** (Free Tier) for testing.
   - **t3.small or t3.medium** for production.
4. **Create and Download a Key Pair** (if not already created).
5. Configure **Security Group** (see next step).
6. Click **Launch Instance**.

### **2️⃣ Configure Security Group**
1. Open **EC2 → Security Groups**.
2. Edit **Inbound Rules** and add the following:
   - **SSH** → TCP → **22** → Source: `0.0.0.0/0`
   - **HTTP** → TCP → **80** → Source: `0.0.0.0/0`
   - **HTTPS** → TCP → **443** → Source: `0.0.0.0/0`
   - **Custom TCP** → TCP → **6767** (Your API Port) → Source: `0.0.0.0/0`

---

## **2. Connect to EC2 via SSH**

Use the **.pem key** to connect:

```bash
ssh -i "C:\Users\YourUserName\Downloads\nodejs.pem" ubuntu@your-ec2-public-ip
```

---

## **3. Copy Your Project to EC2**

On **your local machine**, run:

```bash
scp -i "C:\Users\YourUserName\Downloads\nodejs.pem" -r "D:\DSA\node-authentication-project1" ubuntu@your-ec2-public-ip:/home/ubuntu/
```

Now, your project is in `/home/ubuntu/node-authentication-project1` on EC2.

---

## **4. Install Docker & Docker-Compose on EC2**

Run these commands on EC2:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y

# Start and Enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add Ubuntu user to Docker group
sudo usermod -aG docker ubuntu

# Install Docker-Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Verify installation:
```bash
docker --version
docker-compose --version
```

---

## **5. Setup `Dockerfile` for Node.js**

Inside your project folder (`/home/ubuntu/node-authentication-project1`), create a `Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6767
CMD ["node", "index.js"]
```

---

## **6. Setup `docker-compose.yml`**

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  auth-service:
    build:
      context: ./
      dockerfile: Dockerfile
    ports:
      - "6767:6767"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: "mongodb+srv://<db_username>:<db_password>@<cluster_name>/<table_name>"
      SECRET_KEY: "my_secret_key"
    networks:
      - microservices-net

  mongodb:
    image: mongo
    container_name: mongodb
    ports:
      - "27018:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - microservices-net

volumes:
  mongo-data:

networks:
  microservices-net:
    external: true
```

---

## **7. Create Docker Network**

Run this command to create the **Docker network** before running `docker-compose`:

```bash
docker network create microservices-net
```

---

## **8. Build and Run Containers**

Navigate to your project directory on EC2:

```bash
cd /home/ubuntu/node-authentication-project1
```

Run the Docker containers:

```bash
docker-compose up --build -d
```

Check running containers:

```bash
docker ps
```

---

## **9. Access the API**

Once the containers are running, access your API using:

```bash
http://your-ec2-public-ip:6767/api/admin/users
```

---

## **10. Set Up a Domain Name (Optional)**

If you want to use **a custom domain with HTTPS**, set up **Nginx as a reverse proxy**.

1. Install Nginx:
   ```bash
   sudo apt install nginx -y
   ```

2. Configure Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

3. Replace the content with:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:6767;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

Now, access your API at:

```bash
http://your-domain.com/api/admin/users
```

---

## **11. Automate Deployment (Optional)**

To **restart the containers automatically**, run:

```bash
docker-compose restart
```

To **pull new updates and redeploy**:

```bash
git pull origin main
docker-compose up --build -d
```

---

### 🎉 Done! Your **Node.js API with MongoDB** is running on **AWS EC2 using Docker!** 🚀





## License
This project is licensed under the **MIT License**.

