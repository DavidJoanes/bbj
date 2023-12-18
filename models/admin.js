var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

var adminSchema = new Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    registrationdate: {
        type: String,
    },
    token: {
        type: String,
    },
})

adminSchema.pre("save", async function(next) {
    var user = this;
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function(error, salt) {
            if (error) {
                return next(error)
            }else {
                var token = jwt.sign(
                    {user_id: user.email},
                    process.env.SECRET,
                    {expiresIn: "1h"})
                bcrypt.hash(user.password, salt, function(error, hash) {
                    if (error) {
                        return next(error)
                    }
                    user.password = hash;
                    user.token = token;
                    next()
                })
            }
        })
    }else {
        return next()
    }
})

adminSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if (error) {
            return callback(error)
        }
        callback(null, isMatch)
    })
}

module.exports = mongoose.model("admins", adminSchema)