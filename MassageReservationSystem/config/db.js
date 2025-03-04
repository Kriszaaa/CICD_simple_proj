const mongoose = require("mongoose");

const connectDB = async() =>{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    });
    
    console.log(`MongoDB Connected :${conn.connection.host}`);
}
// const connectDB = async() =>{
//     const conn = await mongoose.connect("mongodb://mongodb:27017/CICD_MassageShop",{
//         useNewUrlParser : true,
//         useUnifiedTopology : true
//     });
    
//     console.log(`MongoDB Connected :${conn.connection.host}`);
// }

module.exports = connectDB; 