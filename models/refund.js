var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var refundSchema = new Schema({    
    email: {
        type: String,
        require: true
    },
    orderid: {
        type: Number,
        require: true
    },
    status: {
        type: String,
    },
    date: {
        type: String,
    },
})

module.exports = mongoose.model("refunds", refundSchema)