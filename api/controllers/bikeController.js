const bikeSchema = require("../model/bikeSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');

const createBike = (req, res) => {
    const {bikename, type, name, description, image, pricerange, telephone, available, pricePerHour, pricePerDay, wheelsize, tires, manufactured} = req.body
    const bike = new bikeSchema({
        bikename,
        type,
        description,
        image,
        pricerange,
        telephone,
        available,
        pricePerHour,
        pricePerDay,
        wheelsize,
        tires,
        manufactured
    })

    bike.save()
    .then(data => {
        res.status(200).json({
            message : "bike created successfully",
            data
        })
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })   
}

const getAllBikes = (req, res) => {
    bikeSchema.find()
    .sort({"createdAt" : "desc"})
    .then(data => {
         res.status(200).json({
             message : "Bikes fetched successfully",
             Bikes : data
         })
    })
    .catch(err => {
     res.status(500).json({
         error : err
     })
    })
 }
 




module.exports = {
    createBike,
    getAllBikes,
}