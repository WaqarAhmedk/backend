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
        console.log(req.file);
        
        cb(null, true);

        

    }
});
module.exports = uploadAvatar;