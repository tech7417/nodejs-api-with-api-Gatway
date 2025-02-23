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

## License
This project is licensed under the **MIT License**.

