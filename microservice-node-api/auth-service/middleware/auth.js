const User = require('../models/auth-model'); // Ensure correct path to your User model
const { verifyjwtToken } = require('../apiUtils/utils');
require('dotenv').config();
class Auth {
    constructor() { }
    async verifyToken(req, res, next) {
        try {
            const { authorization } = req.headers;
            let token;
            

            if (authorization && authorization.startsWith('Bearer ')) {
                token = authorization.split(' ')[1];
            }

            if (!token) {
                return res.status(403).send({
                    message: "No token provided!"
                });
            }
            const isVerifyToken = await verifyjwtToken(token, process.env.SECRET_KEY,);
            if (!isVerifyToken) {
                return res.status(401).json({ message: "Failed to authenticate token" });
            }

            // Find user by ID from decoded token
            const profile = await User.findById(isVerifyToken._id);
            if (!profile) {
                return res.status(404).json({ message: "User not found" });
            }
            req.auth = isVerifyToken;
            req.profile = profile;
            next();


            // Verify token


        } catch (error) {
            return res.status(500).send({
                message: "An error occurred during token verification.",
                error: error.message
            });
        }
    }
    async isAuthenticated(req, res, next) {
        let user = req.profile && req.auth && req.profile._id.toString() === req.auth._id;

        if (!user) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    }

    async isAdmin(req, res, next) {
        if (req.profile.role != 'admin') {
            return res.status(403).json({ message: "Admin resource access denied" });

        }
        next()
    }
}


module.exports = new Auth();