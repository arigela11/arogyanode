const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name : {
       type : String,
       required : true ,
    },
    phonenumber: {
        type : String,
        required:true
    },
    age:{
        type:String,
        required:true,
    }
    ,
    pincode:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    adharno:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('users',users); 