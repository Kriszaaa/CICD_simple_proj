const mongoose = require('mongoose')

const MassageShopSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add a name'],
        unique: true,
        trim:true, //trim space front and back 
        maxlength:[50,'Name can not be more than 50 word']
    },
    address : {
        type: String,
        required: [true,'Please add an address']
    },
    district:{
        type:String,
        required:[true,'Please add a district']
    },
    province:{
        type:String,
        required:[true,'Please add a province']
    },
    tel:{
        type:String
    },
    open_time: {
        type: String,
        required: [true, 'Please add an open time'],
        match: [
            /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/,
            'Please add a valid time in the format "00:00" to "23:59"',
        ],
    },
    close_time:{
        type: String,
        required:[true , 'Please add a close time'],
        match: [
            /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/,
            'Please add a valid time in the format "00:00" to "23:59"',
        ],
    },
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

MassageShopSchema.pre("deleteOne", { document: true ,query:false} , async function(next){
    console.log(`Reservation begin removed from MassageShop ${this._id}`)
    next();
});

module.exports = {MassageShop : mongoose.model('MassageShop' , MassageShopSchema),MassageShopSchema};