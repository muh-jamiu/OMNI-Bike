const express = require("express")
const route = express.Router()
const bikeController = require("../controllers/bikeController")

route.post("/", bikeController.getAllBikes)
route.post("/create", bikeController.createBike)
route.post("/update", bikeController.UpdateBike)
route.post("/delete", bikeController.DeleteBike)
route.post("/connect", bikeController.newBike)
route.post("/hash", bikeController.hash_)
route.post("/establish", bikeController.establish)


module.exports = route