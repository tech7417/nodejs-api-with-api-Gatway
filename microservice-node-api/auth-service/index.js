const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
 const errorHandler = require('./apiUtils/errorHandle/error-handling');
// Database connection
const connectDB = require('./connection/database_connection');
const redisConnection = require('./connection/redis_connection');
connectDB();

// Middleware
app.use(bodyParser.json());
// Routes
const userRoutes = require('./routes/auth-routes');
app.use('/api/v1/auth/', userRoutes);
app.use(errorHandler)
// Start server function
async function startServer(port) {
   // await redisConnection();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
})

// Start the server
startServer(port);