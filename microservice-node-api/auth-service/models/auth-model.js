const mongoose = require('mongoose');

 const userModal = new mongoose.Schema({
      firstName: {
         type : String,
         required : true
      },
       lastName: {
         type : String,
         required : true 
       },
       email: {
         type : String,
         required : true,
         trim : true,
         unique : true
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
firstOtpRequestTime: { // Field to track the time of the first OTP request of the day
    type: Date,
    required: false,
},
     
       password :{
         type : String,
         required : true
       },
       
       role: { type: String,
         enum: ['user', 'admin'],
          default: 'user' 
        },
       date: {
        type: Date,
        default: Date.now
      }
 })

 userModal.virtual('fullName').
 get(function() { return `${this.firstName} ${this.lastName}`; }).
 set(function(v) {
   // `v` is the value being set, so use the value to set
   // `firstName` and `lastName`.
   const firstName = v.substring(0, v.indexOf(' '));
   const lastName = v.substring(v.indexOf(' ') + 1);
   this.set({ firstName, lastName });
 });


const User = mongoose.model('user', userModal);

module.exports = User;