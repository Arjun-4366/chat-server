const messageModel = require("../models/messageSchema");
const chatModel = require("../models/chatSchema");
const userModel = require("../models/userSchema");

const getAllMessages = async (req, res) => {
  try {
    
    const allmessages = await messageModel.find({ chats: req.params.chatId })
    .populate("send", "userName email")
    .populate("reciever", "status")
    .populate("chats");
    res.json(allmessages);
    //   console.log("all messages" ,allmessages.reciever)
  } catch (error) {
    // res.status(400).json('cannot fetch messages')
    console.log(error.message);
  }
};

const sendNewMessage = async (req, res) => {
  try {
    const { text, chatId } = req.body;
    if (!text || !chatId) {
      res.status(400);
    }
    let time = new Date(  )
     let hours = time.getHours()
     let minutes = time.getMinutes()
     let sendTime = hours + ':' + minutes 
     console.log('time',sendTime)
    let newMessage = await new messageModel({
      send: req.user._id,
      text: text,
      chats: chatId,
      time:sendTime
    });
   
    await newMessage.save();
    newMessage = await messageModel
      .findById(newMessage._id)
      .populate("send", "userName")
      .populate("chats")
      .populate("reciever").exec();

   
    newMessage = await userModel.populate(newMessage, {
      path: "chats.users",
      select: "userName email",
    });
    await newMessage.save();
   
    await chatModel.findByIdAndUpdate(req.body.chatId, {
      lastMessage: newMessage,
    });
    res.json(newMessage);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllMessages,
  sendNewMessage,
};
