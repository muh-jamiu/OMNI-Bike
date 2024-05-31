const rentalSchemaSchema = require("../model/bookingSchema")
const bikeSchema = require("../model/bikeSchema")

const rentBike = (req, res) => {
    const {user, bike, rentHr, expiretime} = req.body
    bikeSchema.find({_id: bike})
    .then(data => {
        if(data.length == 0){
            return res.status(400).json({
                message: "bike does not exist"
            })
        }

        if(!data[0].available){
            return res.status(400).json({
                message: "This bike is not available as of the moment, try another bike"
            })
        }

        const rent = new rentalSchemaSchema({
            user,
            bike,
            rentHr,
            expiretime
        })
    
        rent.save()
        .then(() => {
            bikeSchema.findOneAndUpdate({_id: bike}, {available: false})
            .then(() => {
                res.status(200).json({
                    message : "bike rent is purchased successfully",
                })
            })            
        })
        .catch( err => {
            res.status(500).json({
                message: err
            })
        })   
       
    })
}

const userRentHistory = (req, res) => {    
    const {userId} = req.body
    rentalSchemaSchema.find({user: userId})
    .populate("bike")
    .populate("user")
    .then((data) => {
        if(data.length == 0){
            return res.status(200).json({
                message : "This User does not have bike rental history",
            })
        }

        res.status(200).json({
            message : "User History is fetched successfully",
            data
        })
    })    

}

module.exports = {
    rentBike,
    userRentHistory
}