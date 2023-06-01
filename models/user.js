var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

var userSchema = new Schema({
    accounttype: {
        type: String,
    },
    profileimage: {
        type: Object,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    ratings: {
        type: Array,
    },
    deliveries: {
        type: Number,
    },
    motorcyclemodel: {
        type: String,
    },
    motorcyclecolor: {
        type: String,
    },
    motorcycleplatenumber: {
        type: String,
    },
    suspended: {
        type: Boolean,
    },
    registrationdate: {
        type: String,
    },
    token: {
        type: String,
    }
})

userSchema.pre("save", function(next) {
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

userSchema.methods.newPassword = function(newpassword, callback) {
    bcrypt.genSalt(10, function(error, salt) {
        if (error) {
            return callback(error)
        }
        bcrypt.hash(newpassword, salt, function(error, hash) {
            if (error) {
                return callback(error)
            }
            newpassword = hash;
            callback(null, newpassword)
        })
    })
}

userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if (error) {
            return callback(error)
        }
        callback(null, isMatch)
    })
}

module.exports = mongoose.model("users", userSchema)