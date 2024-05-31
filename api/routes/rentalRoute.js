const express = require("express")
const route = express.Router()
const RentalController = require("../controllers/RentalController")

route.post("/", RentalController.rentBike)
route.post("/history", RentalController.userRentHistory)


module.exports = route