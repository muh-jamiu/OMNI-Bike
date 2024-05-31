const mongoose = require("mongoose")

const schema = mongoose.Schema

const bikesSchema = new schema({
    bikename : {type : String, required : true},
    type : {type : String, required : true},
    // name : {type : String, required : true},
    description : {type : String, required : true},
    image : {type : String, default : "https://capacity.rentbikesoft.pl/grafiki/oferta/256/65ddeb03ee0d8.png"},
    pricerange : {type : String, required : true},
    telephone : {type : String, required : true},
    available : {type : Boolean, default : true},
    pricePerHour : {type : String, required : true},
    pricePerDay : {type : String, required : true},
    wheelsize : {type : String, default : null},
    tires : {type : String, default : null},
    manufactured : {type : String, default : 2024},
},{timestamps : true})

module.exports = mongoose.model("Bikes", bikesSchema)