const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({


    destination: (req, file, callback) => {



        const dpath = path.join(__dirname, '..', '../learnify/src/assets/avatar');




        callback(null, dpath);
    },
    filename: (req, file, callback) => {


        const ext = path.extname(file.originalname);
        const name = req.body.firstname + req.body.lastname + ext;


        callback(null, name);
    },

});


const uploadAvatar = multer({
    storage: storage, fileFilter: (req, file, cb) => {
        if (req.file) {
            if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error("only Jpg and Jpeg files are accepted"));
    
            } 
        }
       
    }
});
module.exports = uploadAvatar;