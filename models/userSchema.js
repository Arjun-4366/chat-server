const mongoose = require('mongoose')
const userModel  = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
    },
    status:{
        type:String,
        required:true,
        default:'Offline'
    }
    
})

module.exports = mongoose.model('Users',userModel)