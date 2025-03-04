const {User} = require("../models/User");

//Get token from model, create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //create token
    const token=user.getSignedJwtToken();
        const options={
            expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
            httpOnly:true
        };
    // in case of production
    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode)
        .cookie('token',token,options)
        .json({
            success: true,
            _id    : user._id,
            name   : user.name,
            email  : user.email,
            token
        });
};

//@desc Register user
//@route POST /api/v1/user/register
//@access Public
exports.register = async(req,res) =>{
    try{
        const {name , email , password , role , tel} = req.body;
        const user = await User.create({
            name,
            email,
            password,
            role,
            tel
        });
        sendTokenResponse(user,200,res);
    }catch(err){
        res.status(400).json({
            success : false,
            message : err.message 
        });
        console.log(err.stack);
    }
};

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async(req,res,next) =>{
    try{
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Please enter an email and password"
            })
        }
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({
            success : false,
            message : "Invalid credentials"
        })
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success : false,
                message : "wrong password"
            })
        }
        sendTokenResponse(user,200,res);
    }catch(err){
        res.status(401).json({
            success : false,
            message : "login failed"
        })
    }
};

//@desc  change password 
//@route PATCH /api/v1/user/change-password
//@access Public
exports.changePassword = async(req,res,next) =>{
    try{
        const {email , password , newpassword } = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                msg : "Please enter an email and password"
            })
        }
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({
                success : false,
                msg : "Invalid credentials"
            })
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success : false,
                msg : "wrong password"
            })
        }
        // change password 
        user.password = newpassword; 
        await user.save();
        sendTokenResponse(user,200,res);
    }catch(err){
        res.status(401).json({
            success : false,
            message : `change password failed with error ${err.message}`
        })
    }
};

//@desc  update user
//@route PUT /api/v1/user/change-info
//@access Private
exports.updateUser = async(req,res,next) =>{
    try{
        const userId = req.user.id;
        const updateUser = await User.findByIdAndUpdate(
            userId , 
            req.body,{
            new : true,
            runValidators:true 
        })
        res.status(200).json({
            success : true,
            message : "Update user success",
            data : updateUser
        })
    }catch(err){
        res.status(401).json({
            success : false,
            message : `change user info failed with error ${err.message}`
        })
    }
};

exports.getMe = async(req,res,next) =>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success : true,
        data : user
    });
};

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout=async(req,res,next)=>{
    res.cookie('token','none',{
        expires: new Date(Date.now()+ 10*1000),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        data:{}
    });
};