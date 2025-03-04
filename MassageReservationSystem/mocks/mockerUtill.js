const mongoose = require('mongoose');
const {factory} = require('fakingoose');
const {UserSchema} = require("../models/User");
const {MassageShopSchema} = require("../models/MassageShop");
const {ReservationSchema} = require("../models/Reservation");

const userOptions = { 
    resetPasswordToken : {
        skip : true
    },
    resetPasswordExpire : {
        skip : true
    }
}
const userFactory = factory(UserSchema,userOptions);
const userMocks = []
for (let i = 0 ; i< 10 ; i++){    
    const userMock = userFactory.generate({
        password : "$2a$10$wRHuTW2MnlJB5LJmOcjK3ONYE9qvuYpOvpbzjYc0vzlFRIZEZZTxy", // hashed "password"
        createdAt : new Date()
    });
    userMocks.push(userMock)
}
