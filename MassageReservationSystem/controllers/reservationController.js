const {Reservation} = require("../models/Reservation");
const {MassageShop} = require("../models/MassageShop");
const {countUserReservationByUserEmail, checkReservationTime}= require("../utills/reservationUtill");
const { checkTimeFormat } = require("../utills/timeUtill");

//@desc login user reserve a massageshop
//@route POST /api/v1/reservation/
//@access Private
exports.createReservation = async(req,res,next)=>{
    const {massageshop_name ,reservation_date , start_time , end_time} = req.body;
    const user = req.user;
    // check user 
    if(!user){
        res.status(401).json({
            success : false,
            message : "unauthorized"
        });
        return;
    }
    // check request body
    if((!massageshop_name) || (!reservation_date) ||  (!start_time) || (!end_time)){
        res.status(400).json({
            success : false,
            message : "invalid request body"
        });
        return;
    }
    // validate opentime and closetime 
    if(!(checkTimeFormat(start_time) && checkTimeFormat(end_time))){
        res.status(400).json({
            success : false,
            message : "invalid start_time or end_time"
        });
        return;
    }
    // check user's reservation count
    const counts = await countUserReservationByUserEmail(user.email);
    if(counts >= 3){
        res.status(401).json({
            success : false,
            message : `User : ${user.name} has alreadyed reserved up to maximum capacity reservation`
        });
        return;
    }
    // check the massageshop_name 
    const massageshop = await MassageShop.findOne({name: massageshop_name });
    if(!massageshop){
        res.status(400).json({
            success : false,
            message : `Massageshop : ${massageshop_name} is not existed in this reservation system`
        });
        return;
    }
    // check the starttime and endtime 
    if(!checkReservationTime(start_time,end_time,massageshop)){
        res.status(400).json({
            success : false,
            message : `Massageshop : ${massageshop_name} is not available in this reservation time`
        });
        return;
    };
    // validate reservation_date e.g., 'YYYY-MM-DD
    const isValidDate = !isNaN(Date.parse(reservation_date));
    if (!isValidDate) {
        return res.status(400).json({
            success: false,
            message: "Invalid date format for reservation_date"
        });
    }

    try{
        // create new reservation
        const reservation = await Reservation.create({
            reserver_email : user.email,
            massageshop_name : massageshop_name,
            reservation_date : new Date(reservation_date),
            reservation_starttime : start_time,
            reservation_endtime : end_time
        });

        res.status(201).json({
            success : true,
            data : reservation,
            message : "reservation success"
        });
        
    }catch(err){
        res.status(400).json({
            success : false,
            message : err.message
        });
        console.log(err.stack);
    }
};

exports.getReservations = async(req,res,next) => {
    let query;


    //Copy req.query
    const reqQuery = {...req.query}
    
    const removeFields = ['select' , 'sort']

    removeFields.forEach(param=> delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)
    query = Reservation.find(JSON.parse(queryStr))
    if(req.user.role != 'admin'){
        query = query.find({reserver_email:req.user.email})
    }
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else{
        query = query.sort('-createAt')
    }

    try{
        const reservations = await query
        res.status(200).json({success:true , count:reservations.length , data : reservations})
    } catch(err){
        res.status(400).json({success:false})
    }
}

exports.getReservation = async(req,res,next) =>{
    try{
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation){
            return res.status(400).json({
                success : false
            });
        }
        if(req.user.role !== 'admin' && reservation.reserver_email !== req.user.email){
            res.status(401).json({success:false , msg:"User not authorized to this reservation"})
        }
        res.status(200).json({
            success : true,
            data : reservation
        });
    }catch(err){
        res.status(400).json({
            success : false,
        });
    }
}
exports.updateReservation = async(req,res,next) =>{
    try{
        let reservation = await Reservation.findById(req.params.id)
        if(!reservation){
            res.status(400).json({success:false})
        }
        if(req.user.role !== 'admin' && reservation.reserver_email !== req.user.email){
            res.status(401).json({success:false , msg:"User not authorized to this reservation"})
        }
        reservation = await Reservation.findByIdAndUpdate(req.params.id , req.body,{
            new : true,
            runValidators:true 
        })
           
        res.status(200).json({success:true , msg:`Update reservation ${req.params.id}` , data:reservation})
        
    }catch(err){
        res.status(400).json({success:false})
    }
}
exports.deleteReservation = async(req,res,next) =>{
    try{
        const reservation = await Reservation.findById(req.params.id)
        if(!reservation){
            res.status(400).json({success:false})
        }
        if(req.user.role !== 'admin' && reservation.reserver_email !== req.user.email){
            res.status(401).json({success:false , msg:"User not authorized to this reservation"})
        }else{
            await reservation.deleteOne();
            res.status(200).json({success:true , msg:`Delete reservation ${req.params.id}`,data:{}})    
        }
    }catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
}