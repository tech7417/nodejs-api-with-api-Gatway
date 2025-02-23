const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const port = process.env.PORT || 6000;

// Database connection
const connectDB = require('./connection/connection2');
connectDB();

// Middleware
app.use(bodyParser.json());

// product  Routes
const productRoutes = require('./routes/product.routes');
app.use('/api/v1/product', productRoutes);
app.use((err, req, res, next) => {
    if (!err.status) {
        err.status = 500; // Default to Internal Server Error
    }

    res.status(err.status).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});


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