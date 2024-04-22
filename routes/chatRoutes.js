const express = require('express')
const Router = express.Router()
const chatController = require('../controllers/chatController')
const {authenticate} = require('../middlewares/authentication')


Router.post('/chatAccess',authenticate,chatController.chatAccess)
Router.post('/getChats',authenticate,chatController.getChats)
Router.post('/creategroup',authenticate,chatController.createNewGroup)
Router.get('/getGroups',chatController.getAllGroups)
// Router.post('/searchChats',chatController.searchChats)

module.exports = Router