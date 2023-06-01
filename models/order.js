var mongoose = require("mongoose")
var Schema = mongoose.Schema;

orderSchema = new Schema({
    status: {
        type: String,
        require: true
    },
    orderid: {
        type: Number,
        unique: true
    },
    owneremail: {
        type: String,
        require: true
    },
    ownerfullname: {
        type: String,
        require: true
    },
    ownerphonenumber: {
        type: String,
        require: true
    },
    deliveryaddress: {
        type: String,
        require: true
    },
    closestlandmark: {
        type: String,
        require: true
    },
    apartment: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    province: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    paid: {
        type: Boolean,
        require: true
    },
    items: {
        type: Array,
        require: true
    },
    total: {
        type: Number,
        require: true
    },
    dateplaced: {
        type: Object,
    },
    timeplaced: {
        type: Object,
    },
    dateaccepted: {
        type: Object,
    },
    timeaccepted: {
        type: Object,
    },
    estimateddate: {
        type: Object,
    },
    estimatedtime: {
        type: Object,
    },
    estimatedduration: {
        type: String,
    },
    reasonforcancellation: {
        type: String,
    },
    deliveryreceipt: {
        type: Boolean,
    },
    dispatcher: {
        type: String,
    },
})

module.exports = mongoose.model("orders", orderSchema)