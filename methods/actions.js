var userModel = require("../models/user")
var adminModel = require("../models/admin")
var packageModel = require("../models/package")
var orderModel = require("../models/order")
var locationModel = require("../models/location")
var refundModel = require("../models/refund")
var complaintModel = require("../models/complaint")
var dataLogModel = require("../models/data_log")
var jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const imageUploader = require("../configs/image_uploader")
const dateConverter = require("../configs/date_converter")
const estimatedDate = require("../configs/estimated_date")
const estimatedTime = require("../configs/estimated_time")
const toTitleCase = require("../configs/title_case")
const cloudinary = require("../configs/cloudinary_config")


module.exports = functions = {
    profileImage: async(req, res) => {
        let imageDir = null
        try {
            imageUploader(req, res, (error) => {
                const data = req.body
                if (data.category == "coverimage") {
                    imageDir = "cover_images"
                }else if (data.category == "packageimage") {
                    imageDir = "package_images"
                }else {
                    imageDir = "profile_images"
                }
                if (error) {
                    console.log("Error occured while uploading profile image!: "+error)
                    return res.status(403).json({
                        success: false,
                        message: "Error occured while uploading profile image!"
                    })
                }else {
                    (async() => {
                        var userExist = await userModel.findOne({email: data.email})
                        try{
                            await cloudinary.uploader.destroy(userExist["profileimage"]["id"])
                        } catch(e) {
                            console.log(`There was no profile image initially: ${e}`)
                        }
                        const result = await cloudinary.uploader.upload(req.file.path, {folder: imageDir})
                        await userModel.findOneAndUpdate(
                            {email: data.email},
                            {profileimage: {
                                url: result.secure_url,
                                id: result.public_id,
                            }},
                            {new: true, runValidators: true}
                        )
                        var newLog = dataLogModel({
                            email: data.email,
                            logtype: `Replaced profile image`,
                            date: new Date().toISOString().split('T')[0],
                            time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                        })
                        newLog.save()
                        var user = await userModel.findOne({email: data.email})
                        return res.status(200).json({
                            success: true,
                            message: "Profile image replaced successfully..",
                            data: user
                        })
                    }) ()
                }
            })
        } catch(error) {
            console.log("Error occured while uploading image!: "+error)
            return res.status(500).json({
                success: false,
                message: "Unable to upload image! Please check your internet connection.",
                data: []
            })
        }
    },
    coverImage: async(req, res) => {
        let imageDir = null
        try {
            imageUploader(req, res, (error) => {
                const data = req.body
                if (data.category == "coverimage") {
                    imageDir = "cover_images"
                }else if (data.category == "packageimage") {
                    imageDir = "package_images"
                }else {
                    imageDir = "profile_images"
                }
                if (error) {
                    console.log("Error occured while uploading cover image!: "+error)
                    return res.status(403).json({
                        success: false,
                        message: "Error occured while uploading cover image!"
                    })
                }else {
                    (async() => {
                        var packageExist = await packageModel.findOne({packagename: data.packagename})
                        try{
                            await cloudinary.uploader.destroy(packageExist["coverimage"]["id"])
                        } catch(e) {
                            console.log(`There was no cover image initially: ${e}`)
                        }
                        const result = await cloudinary.uploader.upload(req.file.path, {folder: imageDir})
                        await packageModel.findOneAndUpdate(
                            {packagename: data.packagename},
                            {coverimage: {
                                url: result.secure_url,
                                id: result.public_id,
                            }},
                            {new: true, runValidators: true}
                        )
                        var newLog = dataLogModel({
                            email: data.email,
                            logtype: `Admin replaced ${data.packagename} package cover image`,
                            date: new Date().toISOString().split('T')[0],
                            time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                        })
                        newLog.save()
                        var package = await packageModel.findOne({packagename: data.packagename})
                        return res.status(200).json({
                            success: true,
                            message: "Cover photo replaced successfully..",
                            data: package
                        })
                    }) ()
                }
            })
        } catch(error) {
            console.log("Error occured while uploading image!: "+error)
            return res.status(500).json({
                success: false,
                message: "Unable to upload image! Please check your internet connection.",
                data: []
            })
        }
    },
    image: async(req, res) => {
        let imageDir = null
        try {
            imageUploader(req, res, (error) => {
                const data = req.body
                if (data.category == "coverimage") {
                    imageDir = "cover_images"
                }else if (data.category == "packageimage") {
                    imageDir = "package_images"
                }else {
                    imageDir = "profile_images"
                }
                if (error) {
                    console.log("Error occured while uploading image!: "+error)
                    return res.status(403).json({
                        success: false,
                        message: "Error occured while uploading image!"
                    })
                }else {
                    (async() => {
                        var packageExist = await packageModel.findOne({packagename: data.packagename})
                        const result = await cloudinary.uploader.upload(req.file.path, {folder: imageDir})
                        packageExist["images"] = [...packageExist["images"], result.secure_url]
                        await packageModel.findOneAndUpdate(
                            {packagename: data.packagename},
                            {...packageExist},
                            {new: true, runValidators: true}
                        )
                        var newLog = dataLogModel({
                            email: data.email,
                            logtype: `Admin added an image to ${data.packagename} package`,
                            date: new Date().toISOString().split('T')[0],
                            time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                        })
                        newLog.save()
                        var package = await packageModel.findOne({packagename: data.packagename})
                        console.log(package["images"])
                        return res.status(200).json({
                            success: true,
                            message: "image added successfully..",
                            data: package
                        })
                    }) ()
                }
            })
        } catch(error) {
            console.log("Error occured while uploading image!: "+error)
            return res.status(500).json({
                success: false,
                message: "Unable to upload image! Please check your internet connection.",
                data: []
            })
        }
    },
    signup: async(req, res) => {
        const data = req.body;
        var currentDate = dateConverter
        try {
            const userExist = await userModel.find({email: data.email})
            if (userExist.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "Account already exist! Please sign in."
                })
            }else {
                var newUser = userModel({
                    accounttype: "user",
                    profileimage: {
                        "url": "",
                        "id": "",
                    },
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phonenumber: data.phonenumber,
                    password: data.password,
                    ratings: [4],
                    deliveries: 0,
                    motorcyclemodel: "",
                    motorcyclecolor: "",
                    motorcycleplatenumber: "",
                    suspended: true,
                    registrationdate: currentDate,
                    token: "",
                })
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: "Signup",
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newUser.save(function(error, newUser) {
                    if (error) {
                        console.log(`Sign up failed: ${error}`)
                        return res.status(403).json({
                            success: false,
                            message: "Sign up failed!",
                            data: []
                        })
                    }else {
                        (async() => {
                            const transporter = nodemailer.createTransport({
                                service: "gmail",
                                host: "smtp.gmail.com",
                                port: 587,
                                secure: true,
                                auth: {
                                  user: process.env.G_ACCOUNT,
                                  pass: process.env.G_PASS,
                                },
                              });
                              transporter.verify().then(console.log).catch(console.error);
                            await transporter.sendMail({
                                from: '"Bole by Joanes" <bolebyjoanes@gmail.com>', // sender address
                                to: data.email, // list of receivers separated by a comma
                                subject: "Email Verification", // Subject line
                                text: `Your authorization code for signup is: ${data.code}`, // plain text body
                                html: `<b>Your authorization code for signup is: <h2>${data.code}</h2></b>`, // html body
                              }).then(info => {
                                console.log({info});
                              }).catch(console.error);
                        }) ()
                        newLog.save()
                        console.log("Sign up successful, waiting for signup validation.")
                        return res.status(200).json({
                            success: true,
                            message: "Please verify your email address..",
                            data: newUser
                        })
                    }
                })
            }
        } catch(error) {
            console.log("Error occured during sign up!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    signupValidation: async(req, res) => {
        const data = req.body
        try {
            await userModel.findOneAndUpdate(
                {email: data.email},
                {
                    suspended: false,
                },
                {new: true, runValidators: true}

            )
            var newLog = dataLogModel({
                email: data.email,
                logtype: "Signup validation",
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            return res.status(200).json({
                success: true,
                message: "Signup successful..",
                data: []
            })
        } catch(error) {
            console.log("Error occured during sign up validation!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    signin: async(req, res) => {
        var data = req.body;
        let newToken = null
        try {
            userModel.findOne({email: data.email},
                function(error, user) {
                    if (error) throw error
                    if (!user) {
                        return res.status(403).send({
                            success: "false",
                            message: "Authentication failed! Invalid credentials",
                            data: []
                        })
                    }else {
                        user.comparePassword(data.password, async function(error, isMatch) {
                            if (isMatch && !error) {
                                if (user.suspended) {
                                    return res.status(404).send({
                                        success: "suspended",
                                        message: "Account unverified/suspended!\nIf you feel this was done in error, please email us @bolebyjoe@gmail.com",
                                        data: []
                                    })
                                }else {
                                    newToken = jwt.sign(
                                        {user_id: user["email"]},
                                        process.env.SECRET,
                                        {expiresIn: "1h"}, {SameSite: 'None', secure: true})
                                    await userModel.findOneAndUpdate(
                                        {email: data.email},
                                        {
                                            token: newToken,
                                        },
                                        {new: true, runValidators: true})
                                    var newLog = dataLogModel({
                                        email: user["email"],
                                        logtype: "Signin successful",
                                        date: new Date().toISOString().split('T')[0],
                                        time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                                    })
                                    newLog.save()
                                    return res.status(200).send({
                                        success: "true",
                                        message: "Welcome back " + toTitleCase(user.lastname) + "..",
                                        data: user,
                                        pk: process.env.PAYSTACK_PK,
                                        token: newToken,
                                    })
                                }
                            }else {
                                console.log(error)
                                var newLog = dataLogModel({
                                    email: data.email,
                                    logtype: "Signin failed",
                                    date: new Date().toISOString().split('T')[0],
                                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                                })
                                newLog.save()
                                return res.status(403).send({
                                    success: "false2",
                                    message: "Authentication failed! Invalid credentials.",
                                    data: []
                                })
                            }
                        })
                    }
                })
        } catch(error) {
            console.log("Error occured during sign in!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    validate: function(req, res) {
    }, 
    restoreSignin: async(req, res) => {
        const data = req.body
        try {
            userModel.findOne({email: data.email},
                function(error, user) {
                    if (error) throw error
                    if (!user) {
                            return res.status(403).send({
                                success: false,
                                message: "Authentication failed! Invalid credentials",
                                data: []
                            })
                    }else {
                        return res.status(200).send({
                            success: true,
                            message: "Your token is still alive..",
                            data: user,
                            pk: process.env.PAYSTACK_PK,
                            token: user["token"],
                        })
                    }
                })
        } catch(error) {
            console.log("Error occured during sign in!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    ratePackage: async(req, res) => {
        const data = req.body;
        try {
            var packageExist = await packageModel.findOne({packagename: data.packagename})
            packageExist["ratings"] = [...packageExist["ratings"], data.rating]
            data.review != ""
            ? packageExist["reviews"] = [...packageExist["reviews"], {"name": data.reviewer, "review": data.review}]
            : null
            await packageModel.findOneAndUpdate(
                {packagename: data.packagename},
                {...packageExist},
                {new: true, runValidators: true}
            )
            var newLog = dataLogModel({
                email: data.email,
                logtype: `Rated(${data.rating}) and possibly reviewed ${data.packagename} package`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            var package = await packageModel.findOne({packagename: data.packagename})
            console.log(package["ratings"])
            return res.status(200).json({
                success: true,
                message: "Thank you for your time..",
                data: package
            })
        } catch(error) {
            console.log("Error occured while adding a rating to this package!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchDiscountedPackages: async(req, res) => {
        try {
            var discountedExist = await packageModel.find({discount: {$gt: 0}})
            if (discountedExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No package found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: "Discounted packages retrieved successfully..",
                    data: discountedExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch discounted packages!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchNormalPackages: async(req, res) => {
        try {
            var normalExist = await packageModel.find({discount: 0})
            if (normalExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No package found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: "Normal packages retrieved successfully..",
                    data: normalExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch normal packages!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    checkForPODEligibility: async(req, res) => {
        const data = req.body
        let myCompletedOrders = []
        try{
            var myOrders = await orderModel.find({owneremail: data.email}).sort({"dateplaced": 0})
            if (myOrders.length == 0) {
                console.log("No order found")
                return res.status(403).json({
                    success: "no-order-found",
                    message: `No order found!`,
                })
            }else {
                myOrders.forEach((order) => {
                    if (order["status"] == "delivered") {
                        myCompletedOrders.push(order)
                    }
                })
                if (myCompletedOrders.length > 9) {
                    console.log("You're eligible for 'Pay on delivery' feature..")
                    return res.status(200).json({
                        success: "true",
                        message: `Eligibility confirmed..`,
                    })                    
                }else {
                    console.log("You're not eligible for 'Pay on delivery' feature!")
                    return res.status(404).json({
                        success: "not-eligible",
                        message: `Eligibility denied!`,
                    })
                }
            }
        } catch(error) {
            console.log("Error occured while checking for eligibility!: "+error)
            return res.status(500).json({
                success: "false",
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    validateOrderId: async(req, res) => {
        const data = req.body;
        try {
            var orderExist = await orderModel.find({orderid: data.orderid})
            if (orderExist.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "Regenerating order-id..."
                })
            }else {
                return res.status(200).json({
                    success: true,
                    message: "Unique order id.."
                })
            }
        } catch(error) {
            console.log("Error occured while validating unique order id!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }

    },
    placeOrder: async(req, res) => {
        const data = req.body;
        try {
            var orderExist = await orderModel.find({orderid: data.orderid})
            if (orderExist.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "Regenerate order-id!"
                })
            }else {
                var newOrder = orderModel({
                    status: data.status,
                    orderid: data.orderid,
                    owneremail: data.owneremail,
                    ownerfullname: data.ownerfullname,
                    ownerphonenumber: data.ownerphonenumber,
                    deliveryaddress: data.deliveryaddress,
                    closestlandmark: data.closestlandmark,
                    apartment: data.apartment,
                    city: data.city,
                    province: data.province,
                    country: data.country,
                    paid: data.paid,
                    items: data.items,
                    total: data.total,
                    dateplaced: new Date().toISOString().split('T')[0],
                    timeplaced: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                    datetimeaccepted: new Date(),
                    dateaccepted: "",
                    timeaccepted: "",
                    estimateddate: "",
                    estimatedtime: "",
                    estimatedduration: "",
                    reasonforcancellation: "",
                    deliveryreceipt: false,
                    dispatcher: "",
                })
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: `Order-${data.orderid} placed`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newOrder.save()
                newLog.save()
                console.log("Order placed successfully")
                return res.status(200).json({
                    success: true,
                    message: `Order placed successfully..`,
                    data: newOrder
                })
            }
        } catch(error) {
            console.log("Error occured while placing an order!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    cancelOrder: async(req, res) => {
        const data = req.body;
        try {
            var orderExist = await orderModel.findOne({orderid: data.orderid})
            if (!orderExist) {
                return res.status(403).json({
                    success: false,
                    message: `Order not found!`,
                    data: []
                })
            }else {
                await orderModel.findOneAndUpdate(
                    {orderid: data.orderid},
                    {
                        status: "cancelled",
                        reasonforcancellation: data.reason,
                    },
                    {new: true, runValidators: true}
                )
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: `Order-${data.orderid} cancelled`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newLog.save()
                var order = await orderModel.findOne({orderid: data.orderid})
                console.log("Order cancelled successfully")
                return res.status(200).json({
                    success: true,
                    message: `Order cancelled successfully..`,
                    data: order,
                })
            }
        } catch(error) {
            console.log("Error occured while trying to cancel an order!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchMyOrders: async(req, res) => {
        const data = req.body;
        let active = []
        let completed = []
        let cancelled = []
        try {
            var ordersExist = await orderModel.find({owneremail: data.email}).sort({"_id": -1})
            if (ordersExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No order found!",
                    data: []
                })
            }else {
                ordersExist.forEach((order) => {
                    if (order["status"] == "en-route" || order["status"] == "awaiting rider") {
                        active.push(order)
                    }else if (order["status"] == "delivered") {
                        completed.push(order)
                    }else {
                        cancelled.push(order)
                    }
                })
                return res.status(200).send({
                    success: true,
                    message: `Orders made by ${data.email} retrieved successfully..`,
                    data: ordersExist,
                    dataActive: active,
                    dataCompleted: completed,
                    dataCancelled: cancelled
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch orders made by this user!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    confirmOrderedDelivered: async(req, res) => {
        const data = req.body
        try {
            await orderModel.find({owneremail: data.email},
                function(error, orders) {
                    if (error) throw error
                    if (!orders) {
                        return res.status(403).send({
                            success: false,
                            message: "No order found!",
                            data: []
                        })
                    }else {
                        orders.forEach((order) => {
                            if (order["deliveryreceipt"]) {
                                res.status(200).send({
                                    success: true,
                                    message: "Hey Boss,\nWe're sure you've received your order.\nPlease rate your dispatcher..",
                                    oderid: order["orderid"],
                                    dispatcher: order["dispatcher"],
                                })
                            }
                        })
                    }
                }
            )
        } catch(error) {
            console.log("Error occured trying confirm delivery receipt!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }

    },
    fetchActiveDeliveryOrders: async(req, res) => {
        const data = req.body;
        let activeOrdersForMe = []
        try {
            var awaitingOrder = await orderModel.find({status: "awaiting rider"}).sort({"_id": -1})
            var enrouteOrder = await orderModel.find({status: "en-route"}).sort({"_id": -1})
            if (enrouteOrder.length > 0 || awaitingOrder.length > 0) {
                enrouteOrder.forEach((order) => {
                    if (order["owneremail"] != data.email && order["dispatcher"] == data.email) {
                        activeOrdersForMe.push(order)
                    }
                })
                awaitingOrder.forEach((order) => {
                    if (order["owneremail"] != data.email) {
                        activeOrdersForMe.push(order)
                    }
                })
                return res.status(200).send({
                    success: true,
                    message: `Active orders retrieved successfully..`,
                    data: activeOrdersForMe
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch active orders!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchCompletedDeliveryOrders: async(req, res) => {
        const data = req.body;
        let deliveredOrdersForMe = []
        try {
            var completedOrder = await orderModel.find({status: "delivered"}).sort({"_id": -1})
            if (completedOrder.length > 0) {
                completedOrder.forEach((order) => {
                    if (order["dispatcher"] == data.email) {
                        deliveredOrdersForMe.push(order)
                    }
                })
                return res.status(200).send({
                    success: true,
                    message: `Delivered orders retrieved successfully..`,
                    data: deliveredOrdersForMe
                })
            }else {
                return res.status(403).send({
                    success: false,
                    message: "No order found!",
                    data: []
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch delivered orders!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    checkEligibilityForDiscountedPackage: async(req, res) => {
        const data = req.body;
        let numberOfPacks = []
        var currentYear = new Date().toISOString().split('T')[0].split('-')[0]
        try {
            var ordersExist = await orderModel.find({owneremail: data.email})
            ordersExist.forEach((order) => {
                if (order["status"] != "cancelled") {
                    order["items"].forEach((item) => {
                        if (item["packagename"] == data.packagename  && order["dateplaced"].split("-")[0] == currentYear) {
                            numberOfPacks.push(item)
                        }
                    })
                }
            })
            if (numberOfPacks.length > 0) {
                console.log("ineligible");
                return res.status(200).json({
                    status: "ineligible",
                    message: "You are ineligible for this package!\nThis most likely because you have previously ordered for this package this year.",
                })
            }else {
                console.log("eligible");
                return res.status(200).json({
                    status: "eligible",
                    message: "You are eligible for this package..",
                })
            }
        } catch(error) {
            console.log("Error occured while checking for package eligibility!: "+error)
            return res.status(500).json({
                status: "no-connection",
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    acceptOrder: async(req, res) => {
        const data = req.body;
        let currentEnrouteOrders = []
        let currentEnrouteOrdersForMe = []
        try {
            var ordersExist = await orderModel.find().sort({"dateplaced": 0})
            if (ordersExist.length == 0) {
                return res.status(403).send({
                    success: "no-order",
                    message: "No order found!",
                    data: []
                })
            }else {
                ordersExist.forEach((order) => {
                    if (order["status"] == "en-route") {
                        currentEnrouteOrders.push(order)
                    }
                })
                currentEnrouteOrders.forEach((order) => {
                    if (order["dispatcher"] == data.email) {
                        currentEnrouteOrdersForMe.push(order)
                    }
                })
                if (currentEnrouteOrdersForMe.length > 10) {
                    return res.status(404).send({
                        success: "existing-accepted-order",
                        message: `You have ${currentEnrouteOrdersForMe.length} existing order(s) yet to be delivered!`,
                        data: []
                    })
                }else {
                    var specificOrder = await orderModel.findOne({orderid: data.orderid})
                    if (specificOrder["status"] == "awaiting rider") {
                        await orderModel.findOneAndUpdate(
                            {orderid: data.orderid},
                            {
                                status: "en-route",
                                datetimeaccepted: new Date(),
                                dateaccepted: new Date().toISOString().split('T')[0],
                                timeaccepted: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                                estimateddate: estimatedDate((new Date().toISOString().split('T')[0]), data.estimatedDate),
                                estimatedtime: estimatedTime(new Date(), data.estimatedTime),
                                estimatedduration: data.estimatedTime,
                                dispatcher: data.email,
                            },
                            {new: true, runValidators: true}
                        )
                        var newLog = dataLogModel({
                            email: data.email,
                            logtype: `Order-${data.orderid} accepted`,
                            date: new Date().toISOString().split('T')[0],
                            time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                        })
                        newLog.save()
                        console.log("Order accepted..")
                        return res.status(200).send({
                            success: "true",
                            message: "Order accepted..",
                            data: []
                        })
                    }else {
                        return res.status(404).send({
                            success: "false",
                            message: `Order status has changed! Current status: "${specificOrder["status"]}"\nPlease refresh.`,
                            data: []
                        })
                    }
                }
            }
        } catch(error) {
            console.log("Error occured trying to accept order!: "+error)
            return res.status(500).json({
                success: "no-connection",
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    markAsDelivered: async(req, res) => {
        const data = req.body
        try {
            var myData = await userModel.findOne({email: data.email})
            myData["deliveries"] = myData["deliveries"] + 1
            await userModel.findOneAndUpdate(
                {email: data.email},
                {...myData},
                {new: true, runValidators: true}
            )
            await orderModel.findOneAndUpdate(
                {orderid: data.orderid},
                {
                    status: "delivered",
                    deliveryreceipt: true,
                },
                {new: true, runValidators: true}
            )
            var newLog = dataLogModel({
                email: data.email,
                logtype: `Order-${data.orderid} marked as delivered`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            return res.status(200).send({
                success: true,
                message: `Order-${data.orderid} delivered successfully..`,
            })
        } catch(error) {
            console.log("Error occured trying mark order as delivered!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchDispatcher: async(req, res) => {
        const data = req.body;
        try {
            var dispatcherExist = await userModel.findOne({email: data.dispatcherEmail})
            if (!dispatcherExist) {                
                return res.status(403).send({
                    success: false,
                    message: "Dispatcher not found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `Dispatcher found..`,
                    data: dispatcherExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch dispatcher!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    rateDispatcher: async(req, res) => {
        const data = req.body;
        try {
            var dispatcherExist = await userModel.findOne({email: data.dispatcherEmail})
            dispatcherExist["ratings"] = [...dispatcherExist["ratings"], data.rating]
            await userModel.findOneAndUpdate(
                {email: data.dispatcherEmail},
                {...dispatcherExist},
                {new: true, runValidators: true}
            )
            await orderModel.findOneAndUpdate(
                {orderid: data.orderid},
                {
                    deliveryreceipt: false,
                },
                {new: true, runValidators: true}
            )
            var newLog = dataLogModel({
                email: data.email,
                logtype: `Rated dispatcher(${data.dispatcherEmail}) by ${data.rating}`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            var dispatcher = await userModel.findOne({email: data.dispatcherEmail})
            console.log(dispatcher["ratings"])
            return res.status(200).json({
                success: true,
                message: "Thank you..",
                data: dispatcher
            })
        } catch(error) {
            console.log("Error occured while rating a dispatcher!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }

    },
    dontRateDispatcher: async(req, res) => {
        const data = req.body;
        try {
            await orderModel.findOneAndUpdate(
                {orderid: data.orderid},
                {
                    deliveryreceipt: false,
                },
                {new: true, runValidators: true}
            )
            return res.status(200).json({
                success: true,
                message: "Thanks anyway..",
                data: []
            })
        } catch(error) {
            console.log("Error occured while rating a dispatcher!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }

    },
    fetchUser: async(req, res) => {
        const data = req.body;
        try {
            var userExist = await userModel.findOne({email: data.userEmail})
            if (!userExist) {                
                return res.status(403).send({
                    success: false,
                    message: "User not found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `User found..`,
                    data: userExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch user!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    validateEmailAndSendCode: async(req, res) => {
        const data = req.body
        try {
            var userExist = await userModel.findOne({email: data.email})
            if (!userExist) {
                return res.status(403).send({
                    success: false,
                    message: "Invalid email address!",
                    data: []
                })
            }else {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: true,
                    auth: {
                      user: process.env.G_ACCOUNT,
                      pass: process.env.G_PASS,
                    },
                  });
                  transporter.verify().then(console.log).catch(console.error);
                await transporter.sendMail({
                    from: '"Bole by Joanes" <bolebyjoanes@gmail.com>', // sender address
                    to: data.email, // list of receivers separated by a comma
                    subject: "Authorization Code", // Subject line
                    text: `Your authorization code for password reset is: ${data.code}`, // plain text body
                    html: `<b>Your authorization code for password reset is: <h2>${data.code}</h2></b>`, // html body
                  }).then(info => {
                    console.log({info});
                  }).catch(console.error);
                  return res.status(200).json({
                      success: true,
                      message: "Authorization code sent..",
                      data: []
                  })
            }
            } catch(error) {
            console.log("Error occured trying to validate email!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    updateProfile: async(req, res) => {
        const data = req.body;
        try {
            var userExist = await userModel.findOne({email: data.email})
            if (!userExist) {
                return res.status(403).json({
                    success: false,
                    message: `User not found!`,
                    data: []
                })
            }else {
                await userModel.findOneAndUpdate(
                    {email: data.email},
                    {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        phonenumber: data.phonenumber,
                    },
                    {new: true, runValidators: true}
                )
                await orderModel.updateMany(
                    {owneremail: data.email},
                    {
                        ownerfullname: `${toTitleCase(data.firstname)} ${toTitleCase(data.lastname)}`,
                        ownerphonenumber: data.phonenumber,
                    },
                    {new: true, runValidators: true}
                )
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: `Profile updated`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newLog.save()
                var user = await userModel.findOne({email: data.email})
                console.log("Profile updated successfully")
                return res.status(200).json({
                    success: true,
                    message: `Profile updated..`,
                    data: user,
                })
            }
        } catch(error) {
            console.log("Error occured while trying to update profile!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    logComplaint: async(req, res) => {
        const data = req.body;
        try {
                var newComplaint = complaintModel({
                    email: data.email,
                    subject: data.subject,
                    body: data.body,
                    date: new Date().toISOString().split('T')[0],
                })
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: `Complaint logged`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newComplaint.save()
                newLog.save()
                console.log("Complaint logged successful..")
                return res.status(200).json({
                    success: true,
                    message: `Complaint logged successfully..`,
                    data: newComplaint
                })
        } catch(error) {
            console.log("Error occured while logging a complaint!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchMyComplaints: async(req, res) => {
        const data = req.body
        try {
            var complaintsExist = await complaintModel.find({email: data.email}).sort({"_id": -1})
            if (complaintsExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No complaint found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `Complaints retrieved..`,
                    data: complaintsExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch refund applications for user!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    applyForRefund: async(req, res) => {
        const data = req.body;
        try {
                var newRefund = refundModel({
                    email: data.email,
                    orderid: data.orderid,
                    status: "pending",
                    date: new Date().toISOString().split('T')[0],
                })
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: `Applied for refund for order-${data.orderid}`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newRefund.save()
                newLog.save()
                console.log("Refund application successful..")
                return res.status(200).json({
                    success: true,
                    message: `Refund application sent..`,
                    data: newRefund
                })
        } catch(error) {
            console.log("Error occured while placing an order!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchMyRefunds: async(req, res) => {
        const data = req.body
        try {
            var refundsExist = await refundModel.find({email: data.email}).sort({"_id": -1})
            if (refundsExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No refund application found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `Refund applications retrieved..`,
                    data: refundsExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch refund applications for user!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    addLocation: async(req, res) => {
        const data = req.body;
        try {
                var newLocation = locationModel({
                    email: data.email,
                    nameoflocation: data.nameoflocation,
                    country: "Nigeria",
                    province: "Rivers",
                    city: "Port Harcourt",
                    address: data.address,
                    closestlandmark: data.closestlandmark,
                    apartment: data.apartment,
                })
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: `${data.nameoflocation} location added`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newLocation.save()
                newLog.save()
                console.log("Location added successful..")
                return res.status(200).json({
                    success: true,
                    message: `${data.nameoflocation} location added..`,
                    data: newLocation
                })
        } catch(error) {
            console.log("Error occured while placing an order!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    deleteLocation: async(req, res) => {
        const data = req.body;
        try {
            var locationExist = await locationModel.find({email: data.email})
            if (locationExist.length > 0) {
                locationExist.forEach((loc) => {
                    if (loc["nameoflocation"] == data.nameoflocation) {
                        (async() => {
                            await locationModel.deleteOne({nameoflocation: loc["nameoflocation"]})
                        }) ()
                    }
                })
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: `${data.nameoflocation} location removed`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newLog.save()
                return res.status(200).json({
                    success: true,
                    message: `${data.nameoflocation} removed..`,
                    data: []
                })
            }else {
                return res.status(403).json({
                    success: false,
                    message: "Location not found!",
                    data: []
                })
            }
            
        } catch(error) {
            console.log("Error occured while trying to delete location!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchMyLocations: async(req, res) => {
        const data = req.body
        try {
            var locationExist = await locationModel.find({email: data.email}).sort({"_id": -1})
            if (locationExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No location found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `Locations retrieved..`,
                    data: locationExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch locations for user!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    verifyPassword: async(req, res) => {
        const data = req.body
        let result = false
        try {
            userModel.findOne({email: data.email},
                function(error, user) {
                    if (error) throw error
                    if (!user) {
                            return res.status(403).send({
                                success: "false",
                                message: "Authentication failed! Invalid credentials",
                                data: []
                            })
                    }else {
                        user.comparePassword(data.password, function(error, isMatch) {
                            if (isMatch && !error) {
                                if (user.suspended) {
                                    return res.status(404).send({
                                        success: "suspended",
                                        message: "Account suspended!\nIf you feel this was done in error, please email us @bolebyjoe@gmail.com",
                                        data: []
                                    })
                                }else {
                                    result = true
                                    return res.status(200).send({
                                        success: "true",
                                        message: "Password matches..",
                                        result: result,
                                    })
                                }
                            }else {
                                console.log(error)
                                return res.status(403).send({
                                    success: "false2",
                                    message: "Verification failed! Invalid password.",
                                    data: []
                                })
                            }
                        })
                    }
                })
        } catch(error) {
            console.log("Error occured during password verification!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    updatePassword: async(req, res) => {
        const data = req.body
        try {
            userModel.findOne({email: data.email},
                function(error, user) {
                    if (error) throw error
                    if (!user) {
                            return res.status(403).send({
                                success: false,
                                message: "User not found!",
                                data: []
                            })
                    }else {
                        user.newPassword(data.password, function(error, callback) {
                            if (callback && !error) {
                                (async() => {
                                    await userModel.findOneAndUpdate(
                                        {email: data.email},
                                        {
                                            password: callback,
                                        },
                                        {new: true, runValidators: true}
                                    )
                                    var newLog = dataLogModel({
                                        email: data.email,
                                        logtype: "Password updated",
                                        date: new Date().toISOString().split('T')[0],
                                        time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                                    })
                                    newLog.save()
                                    return res.status(200).json({
                                        success: true,
                                        message: "Password updated successfully..",
                                    })
                                }) ()
                            }
                        })
                    }
                }
            )
        } catch(error) {
            console.log("Error occured while updating password!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },

    // Admin
    adminSignup: async(req, res) => {
        const data = req.body;
        var currentDate = dateConverter
        try {
            const adminExist = await adminModel.find({email: data.email})
            if (adminExist.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "Account already exist! Please sign in."
                })
            }else {
                var newAdmin = adminModel({
                    fullname: data.fullname,
                    email: data.email,
                    password: data.password,
                    registrationdate: currentDate,
                    token: "",
                })
                var newLog = dataLogModel({
                    email: data.email,
                    logtype: "Admin signup",
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newAdmin.save(function(error, newAdmin) {
                    if (error) {
                        console.log(`Sign up failed: ${error}`)
                        return res.status(403).json({
                            success: false,
                            message: "Admin Sign up failed!",
                            data: []
                        })
                    }else {
                        newLog.save()
                        console.log("Admin Sign up successful")
                        return res.status(200).json({
                            success: true,
                            message: "Admin Sign up successful..",
                            data: newAdmin
                        })
                    }
                })
            }
        } catch(error) {
            console.log("Error occured during sign up!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    adminSignin: async(req, res) => {
        var data = req.body;
        let newToken = null
        try {
            adminModel.findOne({email: data.email},
                function(error, admin) {
                    if (error) throw error
                    if (!admin) {
                            return res.status(403).send({
                                success: false,
                                message: "Authentication failed! Invalid credentials",
                                data: []
                            })
                    }else {
                        admin.comparePassword(data.password, async function(error, isMatch) {
                            if (isMatch && !error) {
                                newToken = jwt.sign(
                                    {user_id: admin["email"]},
                                    process.env.SECRET,
                                    {expiresIn: "1h"}, {SameSite: 'None', secure: true})
                                await adminModel.findOneAndUpdate(
                                    {email: data.email},
                                    {
                                        token: newToken,
                                    },
                                    {new: true, runValidators: true})
                                var newLog = dataLogModel({
                                    email: admin["email"],
                                    logtype: "Admin signin",
                                    date: new Date().toISOString().split('T')[0],
                                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                                })
                                newLog.save()
                                return res.status(200).send({
                                    success: true,
                                    message: "Welcome back " + toTitleCase(admin.fullname) + "..",
                                    data: admin,
                                    token: newToken,
                                })
                            }else {
                                return res.status(403).send({
                                    success: false,
                                    message: "Authentication failed! Invalid credentials",
                                    data: []
                                })
                            }
                        })
                    }
                })
        } catch(error) {
            console.log("Error occured during sign in!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    restoreSigninAdmin: async(req, res) => {
        const data = req.body
        try {
            adminModel.findOne({email: data.email},
                function(error, admin) {
                    if (error) throw error
                    if (!admin) {
                        return res.status(403).send({
                            success: false,
                            message: "Authentication failed! Invalid credentials",
                            data: []
                        })
                    }else {
                        return res.status(200).send({
                            success: true,
                            message: "Your token is still alive..",
                            data: admin,
                            token: admin["token"],
                        })
                    }
                })
        } catch(error) {
            console.log("Error occured during sign in!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchOrder: async(req, res) => {
        const data = req.body;
        try {
            var ordersExist = await orderModel.findOne({orderid: data.orderid})
            if (ordersExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "Order not found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `Order-${data.orderid} found..`,
                    data: ordersExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch order!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    addPackage: async(req, res) => {
        const data = req.body;
        try {
            const packageExist = await packageModel.find({packagename: data.packagename})
            if (packageExist.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "Package already exist! Please add another."
                })
            }else {
                var newPackage = packageModel({
                    coverimage: {
                        "url": "",
                        "id": "",
                    },
                    images: [],
                    packagename: data.packagename,
                    description: data.description,
                    text1: data.text1,
                    text2: data.text2,
                    text3: data.text3,
                    price: data.price,
                    discount: data.discount,
                    ratings: [5],
                    reviews: [],
                    available: data.available,
                    admin: data.adminEmail,
                    dateadded: new Date().toISOString().split('T')[0],
                    timeadded: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                var newLog = dataLogModel({
                    email: data.adminEmail,
                    logtype: `Admin added ${data.packagename} package`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newPackage.save()
                newLog.save()
                console.log("Package added successfully")
                return res.status(200).json({
                    success: true,
                    message: `${toTitleCase(data.packagename)} package added successfully..`,
                    data: newPackage
                })
            }
        } catch(error) {
            console.log("Error occured while adding a package!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    updatePackage: async(req, res) => {
        const data = req.body
        try {
            await packageModel.findOneAndUpdate(
                {packagename: data.packagename},
                {
                    packagename: data.packagename,
                    description: data.description,
                    text1: data.text1,
                    text2: data.text2,
                    text3: data.text3,
                    price: data.price,
                    discount: data.discount,
                    available: data.available,
                },
                {new: true, runValidators: true})
                var newLog = dataLogModel({
                    email: data.adminEmail,
                    logtype: `Admin updated ${data.packagename} package`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newLog.save()
                return res.status(200).json({
                    success: true,
                    message: `${toTitleCase(data.packagename)} package updated successfully..`,
                    data: []
                })
        } catch(error) {
            console.log("Error occured while editing a package!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    deletePackage: async(req, res) => {
        const data = req.body;
        try {
            var packageExist = await packageModel.find({packagename: data.packagename})
            if (packageExist.length > 0) {
                (async() => {
                    var packageExist = await packageModel.findOne({packagename: data.packagename})
                    try{
                        await cloudinary.uploader.destroy(packageExist["coverimage"]["id"])
                    } catch(e) {
                        console.log(`There was no cover image initially: ${e}`)
                    }
                }) ()
                await packageModel.findOneAndDelete({packagename: data.packagename})
                var newLog = dataLogModel({
                    email: data.adminEmail,
                    logtype: `Admin deleted ${data.packagename} package`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newLog.save()
                return res.status(200).json({
                    success: true,
                    message: `${data.packagename} package deleted successfully..`,
                    data: []
                })
            }else {
                return res.status(403).json({
                    success: false,
                    message: "Package not found!",
                    data: []
                })
            }
            
        } catch(error) {
            console.log("Error occured while trying to delete a package!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchAllPackages: async(req, res) => {
        try {
            var allPacksExist = await packageModel.find().sort({"_id": -1})
            if (allPacksExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No package found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: "All packages retrieved successfully..",
                    data: allPacksExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch discounted packages!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    updateAccount: async(req, res) => {
        const data = req.body;
        try {
            await userModel.findOneAndUpdate(
                {email: data.email},
                {
                    motorcyclemodel: data.motorcyclemodel,
                    motorcyclecolor: data.motorcyclecolor,
                    motorcycleplatenumber: data.motorcycleplatenumber,
                },
                {new: true, runValidators: true})
            var newLog = dataLogModel({
                email: data.adminEmail,
                logtype: `Admin updated ${data.email} account`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            return res.status(200).json({
                success: true,
                message: `${data.email} account updated successfully..`,
                data: []
            })            
        } catch(error) {
            console.log("Error occured while trying to update a user account!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    convertAccount: async(req, res) => {
        const data = req.body;
        try {
            await userModel.findOneAndUpdate(
                {email: data.email},
                {
                    accounttype: data.accounttype
                },
                {new: true, runValidators: true})
            var newLog = dataLogModel({
                email: data.adminEmail,
                logtype: `Admin converted ${data.email} account to ${data.accounttype}`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            return res.status(200).json({
                success: true,
                message: `${data.email} account converted successfully..`,
                data: []
            })            
        } catch(error) {
            console.log("Error occured while trying to convert a user account!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    suspendAccount: async(req, res) => {
        const data = req.body;
        try {
            await userModel.findOneAndUpdate(
                {email: data.email},
                {
                    suspended: data.isSuspended
                },
                {new: true, runValidators: true})
            var newLog = dataLogModel({
                email: data.adminEmail,
                logtype: data.isSuspended ? `Admin suspended ${data.email} account` : `Admin unsuspended ${data.email} account`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            return res.status(200).json({
                success: true,
                message: data.isSuspended ? `${data.email} account suspended successfully..` : `${data.email} account unsuspended successfully..`,
                data: []
            })            
        } catch(error) {
            console.log("Error occured while trying to suspend/unsuspend a user!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchAllAccounts: async(req, res) => {
        try {
            var usersExist = await userModel.find().sort({"_id": -1})
            if (usersExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No account found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `All user accounts retrieved..`,
                    data: usersExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch all accounts!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchAllOrders: async(req, res) => {
        try {
            var ordersExist = await orderModel.find().sort({"_id": -1})
            if (ordersExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No order found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `All orders retrieved..`,
                    data: ordersExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch all orders!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchAllLocations: async(req, res) => {
        try {
            var locationsExist = await locationModel.find().sort({"_id": -1})
            if (locationsExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No location found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `All locations retrieved..`,
                    data: locationsExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch all locations!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    approveRefund: async(req, res) => {
        const data = req.body
        try {
            await refundModel.findOneAndUpdate(
                {email: data.email},
                {
                    status: "approved",
                },
                {new: true, runValidators: true}
            )
            var newLog = dataLogModel({
                email: data.adminEmail,
                logtype: `Admin approved refund application for order-${data.orderid}`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            console.log("Refund application approved successfully..")
            return res.status(200).json({
                success: true,
                message: `Refund application approved..`,
                data: []
            })

        } catch(error) {
            console.log("Error occured while approving a refund application!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    denyRefund: async(req, res) => {
        const data = req.body
        try {
            await refundModel.findOneAndUpdate(
                {email: data.email},
                {
                    status: "denied",
                },
                {new: true, runValidators: true}
            )
            var newLog = dataLogModel({
                email: data.adminEmail,
                logtype: `Admin denied refund application for order-${data.orderid}`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            console.log("Refund application denied successfully..")
            return res.status(200).json({
                success: true,
                message: `Refund application denied..`,
                data: []
            })

        } catch(error) {
            console.log("Error occured while approving a refund application!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    resetRefund: async(req, res) => {
        const data = req.body
        try {
            await refundModel.findOneAndUpdate(
                {email: data.email},
                {
                    status: "pending",
                },
                {new: true, runValidators: true}
            )
            var newLog = dataLogModel({
                email: data.adminEmail,
                logtype: `Admin reseted refund application for order-${data.orderid}`,
                date: new Date().toISOString().split('T')[0],
                time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
            })
            newLog.save()
            console.log("Refund application reseted successfully..")
            return res.status(200).json({
                success: true,
                message: `Refund application reseted..`,
                data: []
            })

        } catch(error) {
            console.log("Error occured while reseting a refund application!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchAllRefunds: async(req, res) => {
        try {
            var refundsExist = await refundModel.find().sort({"_id": -1})
            if (refundsExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No refund application found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `Refund applications retrieved..`,
                    data: refundsExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch all refund applications!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchAllComplaints: async(req, res) => {
        try {
            var complaintsExist = await complaintModel.find().sort({"_id": -1})
            if (complaintsExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No complaint found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `All complaints retrieved..`,
                    data: complaintsExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch all complaints!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    deleteSpecificDataLogs: async(req, res) => {
        const data = req.body
        try {
            var logsExist = await dataLogModel.find({email: data.email}).sort({"_id": -1})
            if (!logsExist) {
                return res.status(403).send({
                    success: false,
                    message: "No data log found!",
                    data: []
                })
            }else {
                await dataLogModel.deleteMany({email: data.email})
                return res.status(200).send({
                    success: true,
                    message: `All data logs for ${data.email} deleted successfully..`,
                    data: []
                })
            }
        } catch(error) {
            console.log("Error occured trying to delete a user or admin data logs!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchAllDataLogs: async(req, res) => {
        try {
            var logsExist = await dataLogModel.find().sort({"_id": -1})
            if (logsExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "No data log found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `All data logs retrieved..`,
                    data: logsExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch all data logs!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    fetchUserDataLogs: async(req, res) => {
        const data = req.body
        try {
            var logsExist = await dataLogModel.find({email: data.email}).sort({"_id": -1})
            if (logsExist.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: "Logs not found!",
                    data: []
                })
            }else {
                return res.status(200).send({
                    success: true,
                    message: `${data.email} logs found..`,
                    data: logsExist
                })
            }
        } catch(error) {
            console.log("Error occured trying to fetch data logs!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
    deleteAccount: async(req, res) => {
        const data = req.body;
        try {
            var userExist = await userModel.find({email: data.email})
            console.log(`User: ${userExist}`)
            if (userExist.length > 0) {
                await userModel.findOneAndDelete({email: data.email})
                var newLog = dataLogModel({
                    email: data.adminEmail,
                    logtype: `Admin deleted ${data.email} account`,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date(Date.now() + 1 * (60 * 60 * 1000)).toISOString().split('T')[1],
                })
                newLog.save()
                return res.status(200).json({
                    success: true,
                    message: "Account deleted successfully..",
                    data: []
                })
            }else {
                return res.status(403).json({
                    success: false,
                    message: "User not found!",
                    data: []
                })
            }
            
        } catch(error) {
            console.log("Error occured while trying to delete user account!: "+error)
            return res.status(500).json({
                success: false,
                message: "Connection error! Please check your internet connection.",
                data: []
            })
        }
    },
}

module.exports = functions