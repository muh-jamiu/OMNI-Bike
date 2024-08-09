const express = require("express")
const route = express.Router()
const bikeController = require("../controllers/bikeController")

route.post("/", bikeController.getAllBikes)
route.post("/create", bikeController.createBike)
route.post("/update", bikeController.UpdateBike)
route.post("/delete", bikeController.DeleteBike)
route.post("/connect", bikeController.newBike)


module.exports = route