const multer = require("multer")

const storagePath = multer.diskStorage({
    destination: (req, file, callback) => {
        if (req.body.category == "coverimage") {
            callback(null, "public/assets/cover_images")
        }else if (req.body.category == "packageimage") {
            callback(null, "public/assets/package_images")
        }else {
            callback(null, "public/assets/profile_images")
        }
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`)
    },
})

const fileFilter = (req, file, callback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
        callback(null, true)
    }else {
        callback(null, false)
    }
}

const imageUploader = multer({
    storage: storagePath,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
}).single("image")

module.exports = imageUploader