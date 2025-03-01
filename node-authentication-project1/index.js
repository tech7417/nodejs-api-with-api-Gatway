const express = require('express');
const server = express();
 const bodyParser = require('body-parser');
 require('dotenv').config();
 const cors = require("cors");

const PORT = process.env.PORT || 6767;
 const error = require('./error/error');

server.use(bodyParser.json());
const connection = require('./database/connection')
const userRoutes = require('./routes/user-routes');
server.use(error)
connection();
server.use(cors());

server.use("/api", userRoutes);
  function startServer(req, res, next) {
        console.log('Starting server');
        server.listen(PORT, ()=>{
        console.log('server listening on port '+PORT);
})

 }
 startServer();
 process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
})

