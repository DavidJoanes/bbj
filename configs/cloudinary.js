const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: "davidjoanes", //process.env.CLOUDINARY_SECRET_NAME, 
    api_key: "374377417799257", //process.env.CLOUDINARY_SECRET_API, 
    api_secret: "PJ_UW61jU4YcQ30URQyaChXlysc", //process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
  });

module.exports = cloudinary