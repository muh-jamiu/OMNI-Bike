const express = require("express")
const route = express.Router()
const bikeController = require("../controllers/bikeController")

route.post("/", bikeController.getAllBikes)
route.post("/create", bikeController.createBike)
route.get("/create", bikeController.TextBike)


module.exports = route