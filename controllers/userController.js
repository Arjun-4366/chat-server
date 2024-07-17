const userModel = require("../models/userSchema");
const generateToken = require("../config/token");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  const hashedPassword = bcrypt.hash(password, 10);
  return hashedPassword;
};

const loginVerify = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log('username',req.body.userName)
    
    if (!userName && !password) {
      res.json({ message: "Please fill all fields" });
      res.status(400);
      throw Error("Please fill all fields");
    }
    const userData = await userModel.findOne({ userName: userName });
    if (!userData) {
      res.json({ message: "Not a registered user" });
      res.status(400);
      throw Error("Not a registered user");
    } else {
      const passwordCheck = await bcrypt.compare(password, userData.password);
      userData.status = "online";
      await userData.save();
      if (passwordCheck) {
        res.status(201).json({
          _id: userData._id,
          userName: userData.userName,
          email: userData.email,
          token: userData.token,
          status: userData.status,
          password: userData.password,
        });
      } else {
        res.json({ message: "Incorrect password" });
        res.status(400);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const secPassword = await securePassword(password);
    console.log(secPassword);
    if (!userName | !email | !password) {
      res.status(400).json({
        message: "Please fill all fields",
      });
      throw Error("Please fill all fields");
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({
        message: "User already  exists",
      });
      throw Error("User already  exists");
    }

    const userNameTaken = await userModel.findOne({ userName: userName });
    if (userNameTaken) {
      res.status(400).json({
        message: "UserName already taken",
      });
      throw Error("UserName already taken");
    }

    const userData = await userModel.create({
      userName: userName,
      email: email,
      password: secPassword,
    });
    if (userData) {
      res.status(201).json({
        _id: userData._id,
        userName: userData.userName,
        email: userData.email,
        isOnline: true,
        token: generateToken(userData._id),
        password: userData.password,
      });
      userData.token = generateToken(userData._id);
      userData.save();
    } else {
      res.status(400).json({
        message: "Registration failed",
      });
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { userName, email, password, userId } = req.body;
    console.log("userName", userName);
    console.log("email", email);
    console.log("userID", userId);
    const secPassword = await securePassword(password);
    const userData = await userModel.findByIdAndUpdate(
      { _id: userId },
      { userName: userName, email: email, password: secPassword }
    );
    await userData.save();
    console.log("userData", userData);
    res.status(201).json({
      _id: userData._id,
      userName: userData.userName,
      email: userData.email,
      isOnline: true,
      token: userData.token,
      password: userData.password,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const fetchUsers = async (req, res) => {
  try {
    const search = req.query.search
      ? {
          $or: [
            { userName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await userModel.find(search).find({
      _id: { $ne: req.user._id },
    });
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loginVerify,
  register,
  fetchUsers,
  updateUser,
};
