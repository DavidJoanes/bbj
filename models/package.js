var mongoose = require("mongoose")
var Schema = mongoose.Schema;

packageSchema = Schema({
    coverimage: {
        type: Object,
    },
    images: {
        type: Array,
    },
    packagename: {
        type: String,
        unique: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    text1: {
        type: String,
        require: true
    },
    text2: {
        type: String,
        require: true
    },
    text3: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    discount: {
        type: Number,
        require: true
    },
    ratings: {
        type: Array,
    },
    reviews: {
        type: Array,
    },
    available: {
        type: Boolean,
        require: true
    },
    admin: {
        type: String,
        require: true
    },
    dateadded: {
        type: Object,
    },
    timeadded: {
        type: Object,
    },
})

module.exports = mongoose.model("packages", packageSchema)