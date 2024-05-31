const http = require("http")
const app = require("./app")
const mongoose = require("mongoose")

const server = http.createServer(app)
const dbUrl = "mongodb+srv://larvish:larvish007@bikerental.s41h64o.mongodb.net/?retryWrites=true&w=majority&appName=bikeRental"
mongoose.connect(dbUrl)
.then(
    server.listen(3000,() => {
        console.log("App is running in port 3000")
    })
)
.catch(err => {
    console.log(err)
})


