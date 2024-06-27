const express = require("express")
const route = express.Router()
const trackingController = require("../controllers/trackingController")

route.post("/get-map", trackingController.getMap)
route.post("/get-route", trackingController.getRoute)


module.exports = route