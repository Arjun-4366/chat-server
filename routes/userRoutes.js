const express = require('express')
const Router = express.Router()
const userController = require('../controllers/userController')
const { authenticate } = require('../middlewares/authentication')

Router.use(express.json())
Router.use(express.urlencoded({extended:true}))

Router.post('/login',userController.loginVerify)
Router.post('/register',userController.register)
Router.get('/users',authenticate,userController.fetchUsers)
Router.post('/profileUpdate',userController.updateUser)




module.exports = Router 