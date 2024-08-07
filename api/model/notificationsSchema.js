const mongoose = require("mongoose")

const schema = mongoose.Schema

const NotificationSchema = new schema({
    user : {type : mongoose.Schema.Types.ObjectId, required : true, ref: "User"},
    title : {type : String},
    message : {type : String},
},{timestamps : true})

module.exports = mongoose.model("Notifications", NotificationSchema)