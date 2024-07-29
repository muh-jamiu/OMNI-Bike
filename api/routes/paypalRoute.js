const express = require("express")
const route = express.Router()
const paymetController = require("../controllers/paymetController")

route.post("/paypal", paymetController.Paypal)
route.post("/stripe", paymetController._Stripe)
route.get("/cancel-paypal", paymetController.CancelUrl)
route.get("/success-paypal", paymetController.successUrl)


module.exports = route