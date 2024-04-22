const express = require('express')
const messageController = require('../controllers/messageController')
const Router = express.Router()
const {authenticate} = require('../middlewares/authentication')


Router.get('/:chatId',authenticate,messageController.getAllMessages)
Router.post('/',authenticate,messageController.sendNewMessage)



module.exports = Router