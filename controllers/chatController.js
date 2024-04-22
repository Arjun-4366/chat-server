const chatModel = require("../models/chatSchema");
const userModel = require("../models/userSchema");

const chatAccess = async (req, res) => {
  try {
    const { userId } = req.body;
     console.log('userId',userId)
    const userDetails = await userModel.findById(userId);
    console.log("user Details", userDetails);
    const userName = userDetails.userName;
    console.log("userName", userName);

    console.log("Userid", userId);
    if (!userId) {
      console.log("could not find the userId");
      return res.status(400);
    }

    let findChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("lastMessage");

    findChat = await userModel.populate(findChat, {
      path: "lastMessage.send",
      select: "userName email",
    });
    console.log("findchat", findChat.length);
    if (findChat.length > 0) {
      res.send(findChat[0]);
    } else {
      const chatDetails = await new chatModel({
        chatName: userName,
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      await chatDetails.save();

      // let chatComplete = await chatModel.findOne(
      //   { _id: chatDetails._id },
      //   { users: { password: 0 } }
      // );

      // console.log('complete chat',chatComplete)
      // res.status(200).json(chatComplete);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getChats = async (req, res) => {
  try {
   
    const search = req.body.search
    console.log('search chat',search)
    let results;
    if(search.length>0){
     results = await chatModel
     .find({
       $or: [
         {
           chatName: { $regex: ".*" + search + ".*", $options: "i" },
         },
       ],
     })
     .populate("users", "-password")
     .populate("groupAdmin", "-password")
     .populate("lastMessage")
     .populate("isGroupChat")
     .sort({ updatedAt: -1 })
    }
    else{
       results = await chatModel
        .find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("lastMessage")
        .populate("isGroupChat")
        .sort({ updatedAt: -1 });
    }
    results = await userModel.populate(results, {
      path: "lastMessage.send",
      select: "userName email",
    });
    // console.log('results',results)
    res.status(200).json(results);
  }
  catch (error) {
    console.log(error.message);
  }
}

const getAllGroups = async (req, res) => {
  try {
    const groups = await chatModel.where("isGroupChat").equals(true);
    res.status(200).json(groups);
  } catch (error) {
    console.log(error.message);
  }
};

const createNewGroup = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      console.log("insufficient Data");
      return res.status(400);
    }
    let users = req.body.users;
    console.log("users:", users);
    console.log("name", req.body.name);
    // console.log("created groups", req);
    users.push(req.user);
    const newGroup = await new chatModel({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    await newGroup.save();
    const fullGroup = await chatModel
      .findOne({ _id: newGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroup);
  } catch (error) {
    res.status(400);
    console.log(error.message);
  }
};
module.exports = {
  chatAccess,
  getChats,
  getAllGroups,
  createNewGroup,
  
};
