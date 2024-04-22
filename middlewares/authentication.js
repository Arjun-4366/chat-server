const jwt = require('jsonwebtoken')
const userModel = require('../models/userSchema')

let authenticate = async (req,res,next) =>{
   let token
   if(
    req.headers.authorization && req.headers.authorization.startsWith('Bearer')
   ){
    try{
        token = req.headers.authorization.split(" ")[1]
        const tokenDecoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await userModel.findById(tokenDecoded.id).select('-password')
        next()
    }
    catch(error){
        res.status(401).json('Not authorized,token failed')
        throw new Error('Not authorized,token failed')
    }
   }
if(!token){
    res.status(401).json('not authorized,no token')
    throw new Error('not authorized,no token')
}

}   

module.exports = {authenticate}