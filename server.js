const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const passport = require("passport")
const bodyParser = require("body-parser")
const connectDB = require("./configs/db")
const routes = require("./middlewares/route")
require("dotenv").config();

connectDB()

const app =  express()
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cors())
// app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({limit: '5mb', extended: true}))
app.use(express.static("./public"))
app.use(routes)
app.use(passport.initialize())
require("./configs/passport")(passport)

const PORT = process.env.PORT || 7001
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))