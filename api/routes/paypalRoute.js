const express = require("express")
const route = express.Router()
const paymetController = require("../controllers/paymetController")

route.post("/paypal", paymetController.Paypal)


module.exports = route