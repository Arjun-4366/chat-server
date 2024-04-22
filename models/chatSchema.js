        const mongoose  = require('mongoose')
        const chatModel = mongoose.Schema({
            isGroupChat:{
                type:Boolean,
                required:true
            },
            chatName:{
                type:String,
                required:true
            },
            users:[
                {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Users'
            }
        ],
            lastMessage:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Message'
            },
            groupAdmin:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Users'
            },
            unreadMessage:{
                type:Boolean,
                default:false,
            }
        
            // timeStamp:true

        })

    module.exports = mongoose.model('Chat',chatModel)