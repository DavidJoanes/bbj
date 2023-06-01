var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var complaintSchema = new Schema({    
    email: {
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    body: {
        type: String,
    },
    date: {
        type: String,
    },
})

module.exports = mongoose.model("complaints", complaintSchema)