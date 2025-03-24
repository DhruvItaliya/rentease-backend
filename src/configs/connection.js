import mongoose from "mongoose";

export default function connect(){
    
    mongoose.connect(process.env.mongo_URI).then(()=>{
        console.log("connection successfull!");
    }).catch((err)=>{
        console.error(err.message);
        process.exit(1);
    })
} 