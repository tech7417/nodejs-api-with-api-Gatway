const userModal = require('../models/auth-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtToken = require('../apiUtils/utils');
 const customError = require("../apiUtils/errorHandle/commonError")
 const redisClient = require('../connection/redis_connection');
class UserController {
    constructor() { }

    /**
 * Handles user login and sends OTP.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
    async userLoginWithOtp(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email  are required" });
        }
        try {
            const user = await userModal.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found. please register email address " });
            }

            await otpSendToUser(req, res, user, email);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    /**
     * verifyOtp: to verify email address and otp enter by user 
     *  if otp matches genrate jwt token and return to user with message login success
     *  if otp expires  return otp expiration 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */

    async verifyOtp(req, res) {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        try {
            const user = await userModal.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid user or expired OTP." });
            }

            const now = new Date();

            // Check if OTP is expired
            if (now > user.otpExpiry) {
                // OTP is expired, clear the token cookie and return expiry message
                res.clearCookie('token');
                return res.status(401).json({ message: "OTP expired, please login again." });
            }

            // Check if OTP is valid
            if (user && user.otp !== otp || now > user.otpExpiry) {
                user.failedOtpAttempts += 1; // Increment failed attempts
                user.lastFailedOtpAttempt = now;
                await user.save();

                return res.status(401).json({ message: "Invalid OTP." });
            }

            // OTP is valid, reset failed attempts and OTP request count
            user.failedOtpAttempts = 0;

            await user.save();
            const token = jwtToken.genratesToken(user._id);


            res.cookie('token', token, {
                expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
                httpOnly: true  // Accessible only via HTTP, not JavaScript
            });
            const remainingTime = Math.ceil((user.otpExpiry - now) / 60000);

            return res.status(200).json({ message: "OTP verified successfully.", token, expiryTimeOtp: remainingTime });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await userModal.find().lean();
            if (users) {
                return res.status(200).json({ data: users });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async createUser(req, res) {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(404).json({ message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;

        try {
            const isEmailExist = await userModal.findOne({ email });;
            if (isEmailExist) {
                return res.status(400).json({ message: "Email already exists" });
            }
            const user = new userModal(req.body);
            const savedUser = await user.save();
            return res.status(200).json({ data: savedUser });
        } catch (error) {
            next(new customError(error.message));
           // return res.status(500).json({ message: error.message });
        }
    }

    async getSingleUser(req, res) {
        try {
            const id = req.params.id;
            const getUser = await userModal.findById(id);
            if (!getUser) {
                return res.status(404).json({ message: "User not found" });
            }
            req.profile = getUser;

            return res.status(200).json({ data: getUser });

        } catch (error) {
           // return res.status(500).json({ message: error.message });
            next(new customError(error.message));
        }
    }


    async updateUser(req, res) {
        try {
            const user = await userModal.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user)
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async deleteUserById(req, res) {

        try {
            const user = await userModal.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).json({ message: "Email and password are required" });
        }
         try {
            const isEmailExists = await userModal.findOne({ email });
        if (!isEmailExists) {
            return res.status(404).json({ message: "Email not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, isEmailExists.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid password" });
        }
        

        // Generate JWT token
        const token = jwtToken.genratesToken(isEmailExists);
        // Set the token in an HTTP-only cookie
         res.cookie('token', token, {
            expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
            httpOnly: true  // Accessible only via HTTP, not JavaScript
        });
        req.user = { id: decoded._id, isAdmin: user.data.role };
        return res.status(200).json({
            msg: 'Login successful',
            token
        });
         } catch (error) {
              next(new customError(error.message));
         }
        
       

        // Send the response back to the client
      
    }

    async getloginUserProfile(req,res){
        if (!req.profile) {
            return res.status(404).json({ message: "Access Denied" });
        }
     
            return res.status(200).json({ data: req.profile });
    
        
    
            
         
    }

    async login(req, res, next) {
        
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).json({ message: "Email and password are required" });
        }
         try {
            const isEmailExists = await userModal.findOne({ email });
        if (!isEmailExists) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, isEmailExists.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid password" });
        }
        

        // Generate JWT token
        const token = jwtToken.genratesToken(isEmailExists);
        // Set the token in an HTTP-only cookie
         res.cookie('token', token, {
            expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
            httpOnly: true  // Accessible only via HTTP, not JavaScript
        });
        
        return res.status(200).json({
            msg: 'Login successful',
            role: isEmailExists.role,
            token
        });
         } catch (error) {
              next(new customError(error.message));
         }
        
       

        // Send the response back to the client
      
    }
    async logout(req, res) {
        try {
            let token;
            const { authorization } = req.headers;
            if (authorization && authorization.startsWith('Bearer ')) {
                token = authorization.split(' ')[1];
            }
            // if (token) {
            //     await redisClient.set(token, 'blacklisted', { EX: 3600 }); // Set expiration of 1 hour
            // }
    
           // res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'Strict' });
    
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to log out', error: error.message });
        }
    }
}

const otpSendToUser = async (req, res, data, email) => {
    try {
        const now = new Date();

        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        // Check if the first request was made more than 24 hours ago
        if (data.firstOtpRequestTime && now - data.firstOtpRequestTime > oneDay) {
            data.otpRequestCount = 0;
            data.firstOtpRequestTime = now;
        }


        // Increment OTP request count
        data.otpRequestCount += 1;

        // Check if user has exceeded the OTP request limit
        if (data.otpRequestCount > 3) {
            return res.status(429).json({ message: "You have reached the maximum number of OTP requests for today. Please try again after 24 hours." });
        }

        // Set the first request time if not already set
        if (!data.firstOtpRequestTime) {
            data.firstOtpRequestTime = now;
        }


        if (data.otpSentTime && now - data.otpSentTime < 2 * 60000) {
            const remainingTime = Math.ceil((2 * 60000 - (now - data.otpSentTime)) / 1000); // Remaining time in seconds
            return res.status(429).json({ message: "You can resend OTP after some time.", remainingTime });
        } else {
            const otp = jwtToken.generateOtp();

            // Save current OTP and its expiry as last OTP details
            data.lastOtp = data.otp;
            data.lastOtpExpiry = data.otpExpiry;

            // Update with new OTP details
            data.otp = otp;
            data.otpExpiry = new Date(now.getTime() + 2 * 60000); // OTP expires in 2 minutes
            data.otpSentTime = now;
            data.failedOtpAttempts = 0; // Reset failed attempts on successful OTP request

            // Save the updated data (assuming it's a Mongoose model)
            await data.save();

            // Send OTP email
            await jwtToken.sendOtpEmail(email, otp);

            return res.status(200).json({ message: "OTP sent to your email.", remainingTime: 120 }); // 600 seconds (10 minutes)
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = new UserController();