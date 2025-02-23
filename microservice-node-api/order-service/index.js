const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const port = process.env.PORT || 7000;

// Database connection
const connectDB = require('./connection/database_connection');
connectDB();

// Middleware
app.use(bodyParser.json());

// product  Routes
const orderRoutes = require('./routes/order_routes');
app.use('/api/v1/order', orderRoutes); 

// Start server function
function startServer(port) {
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