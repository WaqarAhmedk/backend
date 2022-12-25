const multer = require("multer");
const path = require("path");
const studentmodel = require("../models/studentmodel");
const storage = multer.diskStorage({


    destination: (req, file, callback) => {


        const dpath = path.join(__dirname, '..', '../learnify/src/assets/avatar');




        callback(null, dpath);
    },
    filename: async (req, file, callback) => {

        try {
            const result = await studentmodel.findById(req.params.studentid);
            const ext = path.extname(file.originalname);
            const name = result.firstname + result.lastname + ext;
            callback(null, name);

        } catch (err) {
            console.log(err);
            callback(err);
        }


    },

});


const udpateAvatarMiddleware = multer({
    storage: storage, fileFilter: async (req, file, cb) => {
        console.log("dsaasdasd");
        cb(null, true);




    }
});
module.exports = udpateAvatarMiddleware;