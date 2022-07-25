const multer = require("multer");
const path=require("path")
const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"/home/anonymous-kashmiri/Fyp/backend/data/");
    },
    filename:(req,file,callback)=>{
        callback(null,Date.now()+file.originalname);
    },
    
});


const upload = multer({ storage: storage ,fileFilter:(req,file,cb)=>{
    if (file.mimetype==="application/pdf" ||file.mimetype==="application/msword") {
       cb(null,true);
    } else {
        cb(null,false);
        return cb(new Error("only pdf and .doc files are accepted"));
        
    }
}});
module.exports = upload;