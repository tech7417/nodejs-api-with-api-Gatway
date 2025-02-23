const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
 // Ensure correct path to your User model
const { verifyjwtToken } = require('../utils/apiUtils');

class Auth {
    constructor() { }

    async  verifyToken (req, res, next) {
        try {
            const tokenHeader = req.header('Authorization');
            if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }
    
            const token = tokenHeader.split(' ')[1];
             
            const decoded =  await verifyjwtToken(token, process.env.SECRET);
            const userId = decoded._id;
              console.log( `${process.env.URL}${userId}`)
            const { data: user } = await axios.get(`${process.env.URL}${userId}`);
              
                console.log('Token for profile: ' + JSON.stringify(user));
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
             req.profile = user;
          
             req.user = { id: decoded._id, isAdmin: user.data.role }; // Use res.locals to avoid modifying req
            next();
        } catch (err) {
            const status = err.name === 'JsonWebTokenError' ? 403 : 500;
            res.status(status).json({ message: err.message || 'Internal Server Error' });
        }

    }
  
    
  async   isAuthenticated(req, res, next) {
       let user = req.profile && req.user && req.profile.data._id.toString() === req.user.id;
   
       if (!user) {
           return res.status(403).json({ message: "Access denied" });
       }
   
       next();
   }

    async isAdmin(req, res, next) {
        if (req.user.isAdmin != 'admin') {
            return res.status(403).json({ message: "Admin resource access denied" });

        }
        next()
    }
}


module.exports = new Auth();