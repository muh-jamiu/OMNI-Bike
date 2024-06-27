const express = require("express")
const route = express.Router()
const userController = require("../controllers/userController")

route.get("/", userController.getAllUser)
route.post("/signup", userController.createUser)
route.post("/login", userController.loginUser)
route.post("/get-user", userController.getUserByEmail)
route.post("/verify-code", userController.verifyCode)
route.patch("/update", userController.UpdateUser)
route.post("/reviews", userController.createReview)
route.get("/reviews", userController.getallReviews)
route.get("/bike-reviews", userController.getbikesReviews)
route.post("/request-otp", userController.requestCode)
route.post("/request-password-reset", userController.requestPasswordCode)
route.post("/confirm-password-reset", userController.verifyPasswordReset)


module.exports = route