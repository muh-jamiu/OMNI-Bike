const http = require("http")
const app = require("./app")
const mongoose = require("mongoose")
const express = require('express');
const socketIo = require('socket.io');
const axios = require('axios');

// const app = express();

const server = http.createServer(app)
const io = socketIo(server);
const dbUrl = "mongodb+srv://larvish:larvish007@bikerental.s41h64o.mongodb.net/?retryWrites=true&w=majority&appName=bikeRental"
mongoose.connect(dbUrl)
.then(
    server.listen(3100,() => {
        console.log("App is running in port 3000")
        io.on('connection', (socket) => {
            console.log('a user connected');
        })
    })
)
.catch(err => {
    console.log(err)
})


