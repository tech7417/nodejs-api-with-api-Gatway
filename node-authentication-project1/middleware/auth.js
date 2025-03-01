const userModel = require('../model/user-model');
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.verifyToken =  async function (req, res, next) {
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
        const profile = await userModel.findById(isVerifyToken._id);
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
exports.isAuthenticated = async function (req, res,next){
    let user = req.auth && req.auth && req.profile._id.toString() === req.auth._id;
   
    if (!user) {
        return res.status(403).json({ message: "Access denied" });
    }

    next();
}

exports.isAdmin  = (req, res, next) =>{
    if (req.profile.role != 'admin') {
        return res.status(403).json({ message: "Admin resource access denied" });

    }
    next()
}
   



exports.genratesToken = (data)=> {
    const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    if (token) {
        return token
    }
    return false
}

async function verifyjwtToken(token, secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject({ status: 401, message: "Failed to authenticate token." });
            } else {
                resolve(decoded);
            }
        });

    })
}