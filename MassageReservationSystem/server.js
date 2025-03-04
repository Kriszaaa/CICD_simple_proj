const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer')
const rateLimit=require('express-rate-limit');
const hpp=require('hpp')
const connectDB = require("./config/db");
const homepage = require("./mocks/homepage"); 


// import routers
const userRouter = require("./routes/user");
const reservationRouter = require("./routes/reservation");
const massageshopRouter = require("./routes/massageshop");

dotenv.config({"path":'./config/config.env'})

const app = express()

// connect to DB
connectDB();

// basic app configurations
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(rateLimit({
    windowsMs:10*60*1000, //10 mins
    max: 1000
}));
app.use(hpp());


// home route
app.get('/',(_,res)=>{
     res.setHeader('Content-Type', 'text/html');
     res.send(homepage);
})

// app routing
app.use("/api/v1/user",userRouter);
app.use("/api/v1/reservation",reservationRouter);
app.use("/api/v1/massageshop",massageshopRouter);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT , console.log('Server is running in' , process.env.NODE_ENV , 'mode on port' , process.env.PORT));

//handle promise
process.on('unhandleRejection' , (err,_) =>{
    console.log(`Error : ${err.message}`)
    server.close(() => process.exit(1))
}) 
