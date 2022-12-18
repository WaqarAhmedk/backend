const multer = require("multer");
const path=require("path")
const storage=multer.diskStorage({
    destination:(req,file,callback)=>{



        
        const spath=path.join(__dirname ,'..','public','student-assignments/');
        console.log(spath);

        callback(null,spath);
    },
    filename:(req,file,callback)=>{
        callback(null,Date.now()+file.originalname);
    },
    
});


const SubmitAssignment = multer({ storage: storage ,fileFilter:(req,file,cb)=>{
    if (file.mimetype==="application/pdf"  ||file.mimetype==="application/doc") {
       cb(null,true);
    } else {
        cb(null,false);
        return cb(new Error("only pdf and .doc files are accepted"));
        
    }
}});
module.exports = SubmitAssignment;