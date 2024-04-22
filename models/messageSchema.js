const mongoose = require("mongoose");
const messageModel = mongoose.Schema({
  send: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  chats:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  text:{
    type:String,
    required:true
  },
  time:{
    type:String,
    required:true
  },
//   unreadCount:{
//     type:Boolean,
//     default:false,
// }
});
module.exports = mongoose.model('Message',messageModel)