var mongoose = require("mongoose")
var Schema = mongoose.Schema;

dataLogSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    logtype: {
        type: String,
        require: true
    },
    date: {
        type: Object,
    },
    time: {
        type: Object,
    },
})

module.exports = mongoose.model("data_logs", dataLogSchema)