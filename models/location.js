var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    nameoflocation: {
        type: String,
        require: true
    },
    country: {
        type: String,
    },
    province: {
        type: String,
    },
    city: {
        type: String,
    },
    address: {
        type: String,
        require: true
    },
    closestlandmark: {
        type: String,
        require: true
    },
    apartment: {
        type: String,
        require: true,
    },
})

module.exports = mongoose.model("locations", locationSchema)