const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected... with product serve');  
    } catch (error) {
        console.error('Error connecting to MongoDB2', error);
        process.exit(1); // Exit process with failure
      }
    // try {
    //     await mongoose.connect(, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex: true,
    //         // Increase socket timeout to 45 seconds
    //     });
    //     console.log('MongoDB connected...');
    // } catch (error) {
    //     console.error('Error connecting to MongoDB', error);
    //     process.exit(1); // Exit process with failure
    // }
};

module.exports = connectDB;