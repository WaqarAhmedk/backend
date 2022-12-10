// const multer = require("multer");
// const path = require("path");
// const fs=require("fs")
// let j = 1;
// const storage = multer.diskStorage({


//     destination: (req, file, callback) => {

//         const foldername="user1"
//         const id=req.params.id;
//         console.log(id);

//         const dpath=path.join(__dirname,'..' ,'../learnify/src/labeled_images/'+foldername);
//         console.log(dpath);

//         fs.access(dpath,(error)=>{
//             if(error){
//                 fs.mkdir(dpath,{recursive:true},(error)=>{
//                     if (error) {
//                         console.log("Error "+error);
                        
//                     }else{
//                         console.log("New Folder");
//                     }
//                 })
//             }

//         })

       
//         callback(null, dpath);
//     },
//     filename: (req, file, callback) => {
//         console.log(j);
//         j++
//         const name = j + path.extname(file.originalname);

//         callback(null, name);
//     },

// });


// const upload = multer({
//     storage: storage, fileFilter: (req, file, cb) => {
//         if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error("only Jpg and Jpeg files are accepted"));

//         }
//     }
// });
// module.exports = upload;