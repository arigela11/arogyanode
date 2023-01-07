const mongoose = require('mongoose');

const statused= new mongoose.Schema({
    user : {
       type : String,
       required : true ,
    },
    userid:{
        type : String,
        required : true 
    },
    admin: {
        type : String,
        required:true
    },
    status:{
        type:String,
        required:true,
    }
    
})

module.exports = mongoose.model('statused',statused);