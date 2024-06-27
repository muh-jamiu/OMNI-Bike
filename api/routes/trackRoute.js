const express = require("express")
const route = express.Router()
const trackingController = require("../controllers/trackingController")

route.post("/map", trackingController.getMap)
route.post("/route", trackingController.getRoute)


module.exports = route