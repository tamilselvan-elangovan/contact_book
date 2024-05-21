import express from 'express'
import controller from './authorization_controller'

const app = express()

app.route('/register').post(controller.register)
app.route('/login').post(controller.login)

module.exports = app