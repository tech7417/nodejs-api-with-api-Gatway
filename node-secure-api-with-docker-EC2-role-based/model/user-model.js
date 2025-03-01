const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
 const userSchema =  new mongoose.Schema({
      firstName:{
         required: true,
         type: 'string',
          trim : true,
      },
      lastName:{
        required: true,
        type: 'string',
        trim : true,
     },
     email:{
        required: true,
        type: 'string',
        unique: true,
        lowercase: true,
        trim : true,
     },
     password:{
        required: true,
        minlength: 6,
        type: 'string',
        trim : true,
     },
     userProfilePic: {
        type: String, // Store URL (AWS S3, Cloudinary, or local storage)
        default: "",
      },
      otp: {
        type: String,
        required: false,
    },
    otpExpiry: {
      type: Date,
      required: false,
  },
  otpSentTime: { // Field for tracking OTP sent time
      type: Date,
      required: false,
  },
  lastOtp: { // Field for storing the last OTP
      type: String,
      required: false,
  },
  lastOtpExpiry: { // Field for storing the last OTP expiry time
      type: Date,
      required: false,
  },
  failedOtpAttempts: {
    type: Number,
    default: 0,
},
lastFailedOtpAttempt: {
    type: Date,
    required: false,
},
otpRequestCount: { // Field to track OTP request count
    type: Number,
    default: 0,
},
isVerified: {
    type: Boolean,
    default: false,
  },
firstOtpRequestTime: { // Field to track the time of the first OTP request of the day
    type: Date,
    required: false,
},
        role: { type: String,
         enum: ['user', 'admin'],
          default: 'user' 
        },
        
            googleId: { type: String },
          
      status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
      },
      refreshToken: {
        type: String,
        default: null, // Store refresh token for JWT refresh
      },
      otherDetails: {
        address: { type: String, default: "" },
        phone: { type: String, default: "" },
        dateOfBirth: { type: Date },
      },
    },
    { timestamps: true }
      
 );

 userSchema.pre('save', async  function (next) {

    if (!this.isModified("password")) return next();
    const salth =  await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salth);
     next();
 })
 userSchema.virtual('fullName').
 get(function() { return `${this.firstName} ${this.lastName}`; }).
 set(function(v) {
   // `v` is the value being set, so use the value to set
   // `firstName` and `lastName`.
   const firstName = v.substring(0, v.indexOf(' '));
   const lastName = v.substring(v.indexOf(' ') + 1);
   this.set({ firstName, lastName });
 });

 userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

 userSchema.methods.generateOTP  = () =>{
    const otp = crypto.randomInt(100000, 999999).toString();
    this.otp = bcrypt.hashSync(otp, 10);
    this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
   return otp;
  }

  // Verify OTP
  userSchema.methods.verifyOTP = function (enteredOTP) {
    return bcrypt.compareSync(enteredOTP, this.otp);
  };
  
  const User = mongoose.model("User", userSchema);
  module.exports = User;
