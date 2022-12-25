const mongoose=require("mongoose");
const dbname="learnify";

 const conUri=`mongodb+srv://waqar:waqar@cluster0.roomv.mongodb.net/`+dbname+`?retryWrites=true&w=majority`;
// const conUri="mongodb://localhost:27017/"+dbname;
const ConnectDb=()=>{
try{


    mongoose.connect(conUri).then(()=>{
        console.log("connected to database");
    }).catch((err)=>{
        console.log("Error connecting db ".err);

    });}
    catch(err){
        res.send(err);
        console.log(err);
    }
}

module.exports=ConnectDb;