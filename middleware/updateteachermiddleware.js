const multer = require("multer");
const path = require("path");
const teachermodel = require("../models/teachermodel");
const storage = multer.diskStorage({


    destination: (req, file, callback) => {


        const dpath = path.join(__dirname, '..', '../learnify/src/assets/avatar');




        callback(null, dpath);
    },
    filename: async (req, file, callback) => {

        try {
            const result = await teachermodel.findById(req.params.teacherid);
            const ext = path.extname(file.originalname);
            const name = result.firstname + result.lastname + ext;
            const updated = await teachermodel.findByIdAndUpdate(req.params.teacherid,{
                avatar:name
            });

            callback(null, name);

        } catch (err) {
            console.log(err);
            callback(err);
        }


    },

});


const updateTeacherAvatarMiddleware = multer({
    storage: storage, fileFilter: async (req, file, cb) => {
        console.log("dsaasdasd");
        cb(null, true);




    }
});
module.exports = updateTeacherAvatarMiddleware;