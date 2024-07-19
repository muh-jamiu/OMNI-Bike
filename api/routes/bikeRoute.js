const express = require("express")
const route = express.Router()
const bikeController = require("../controllers/bikeController")

route.post("/", bikeController.getAllBikes)
route.post("/create", bikeController.createBike)
route.post("/update", bikeController.UpdateBike)
route.post("/delete", bikeController.DeleteBike)
route.post("/lock-connect", bikeController.TextBike)


module.exports = route