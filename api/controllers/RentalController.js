const rentalSchemaSchema = require("../model/bookingSchema")
const bikeSchema = require("../model/bikeSchema")
const axios = require('axios');

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

const navigationGPS = async (req, res) => {
    const { start, end } = req.body;
    if (!start || !end) {
        return res.status(400).send('Start and end coordinates are required');
    }

    try {
        const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}`, {
            params: {
                access_token: 'YOUR_MAPBOX_ACCESS_TOKEN',
                alternatives: true,
                geometries: 'geojson',
                steps: true
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json(error.message);
    }
}



module.exports = {
    rentBike,
    userRentHistory,
    navigationGPS
}