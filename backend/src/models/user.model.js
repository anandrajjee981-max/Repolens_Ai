import mongoose from "mongoose";
import { useActionState } from "react";
//we have to make usermodel 
const userschema = new mongoose.Schema({
username:{
    type: String,
    required: true
}
,
email:{
    type: String,
    required: true,
    unique: true
},
password:{
    type: String,
    required: true
}



})


export const usermodel = mongoose.model("users",userschema)

