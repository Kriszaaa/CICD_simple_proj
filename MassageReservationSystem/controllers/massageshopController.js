
//@desc Register massageshop
//@route POST /api/v1/massageshop

const {MassageShop} = require("../models/MassageShop");

//@access Private
exports.createMassageshop = async(req,res) =>{
    const {name ,address , district , province, tel , open_time , close_time } = req.body;
    // check request body
    if((!name) || (!district) || (!province)|| (!address) ||  (!open_time) || (!close_time)  || (!tel)){
        res.status(400).json({
            success : false,
            message : "invalid request body"
        });
        return;
    }
    try{
        // create new massageshop
        const massageshop = await MassageShop.create({
            name,
            address,
            district,
            province,
            tel,
            open_time,
            close_time
        });
        res.status(201).json({
            success : true,
            data : massageshop,
            message : "create massageshop success"
        });
    }catch(err){
        res.status(400).json({
            success : false,
            message : err.message
        });
        console.log(err.stack);
    }
};

exports.getMassageshops = async(req,res,next) => {
    let query;


    //Copy req.query
    const reqQuery = {...req.query}
    
    const removeFields = ['select' , 'sort']

    removeFields.forEach(param=> delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)
    query = MassageShop.find(JSON.parse(queryStr))

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
        const massageshop = await query
        res.status(200).json({success:true , count:massageshop.length , data : massageshop})
    } catch(err){
        res.status(400).json({success:false})
    }
}


exports.getMassageshop = async(req,res,next) =>{
    try{
        const massageshop = await MassageShop.findById(req.params.id);
        if (!massageshop){
            return res.status(400).json({
                success : false
            });
        }
        res.status(200).json({
            success : true,
            data : massageshop
        });
    }catch(err){
        res.status(400).json({
            success : false,
        })
    }
}

exports.updateMassageshop = async(req,res,next) =>{
    try{
        
        massageshop = await MassageShop.findByIdAndUpdate(req.params.id , req.body,{
            new : true,
            runValidators:true 
        })
        if(!massageshop){
            res.status(400).json({success:false})
        }
        
        res.status(200).json({success:true , msg:`Update massageshop ${req.params.id}` , data:massageshop})
        
    }catch(err){
        res.status(400).json({success:false})
    }
}
exports.deleteMassageshop = async(req,res,next) =>{
    try{
        const massageshop = await MassageShop.findById(req.params.id)
        if(!massageshop){
            res.status(400).json({success:false})
        }
        await massageshop.deleteOne();
        res.status(200).json({success:true , msg:`Delete massageshop ${req.params.id}`,data:{}})    
    }catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
}